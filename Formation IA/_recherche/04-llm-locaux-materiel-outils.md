# 04 — LLM locaux, matériel, outillage développeur / agents / sécurité

> Dossier de recherche pour la formation IA 150 h. Date de la recherche : **1er novembre 2026**.
> Méthode : recherche web + lecture des pages (WebSearch / WebFetch). Chaque chiffre est suivi de sa source. Les URL marquées **[vérifiée]** ont été ouvertes ou sont apparues dans un résultat de recherche pendant cette session ; les URL marquées **[non re-vérifiée]** sont des adresses officielles connues qui n'ont pas pu être ré-ouvertes (quota de recherche partagé épuisé en fin de session) — à contrôler avant publication des supports.
> Convention : « B » = milliards de paramètres, « T » = milliers de milliards ; « MoE » = Mixture of Experts (total / actifs) ; « tok/s » = tokens par seconde en génération (decode) sauf mention « prefill ».

---

## 0. Synthèse en 12 points (pour le formateur)

1. **Faire tourner un LLM en local est devenu trivial** : Ollama (`ollama run <modèle>`), LM Studio (interface graphique) ou llama.cpp (moteur de référence, format GGUF) couvrent 95 % des besoins. Tous exposent une API compatible OpenAI (Ollama port 11434, LM Studio port 1234, vLLM port 8000, llama.cpp `llama-server` port 8080) — sources §1.
2. **Le paysage des modèles à poids ouverts a basculé vers la Chine et vers les MoE géants** : Kimi K3 (2,8T), DeepSeek V4.1 Flash (552B), GLM‑5.3 (753B), Qwen3.8‑Max (2,4T) dominent les classements ouverts ; côté occidental : Gemma 4 (Google, Apache 2.0), gpt‑oss (OpenAI, Apache 2.0), Mistral Small 4 / Large 3 (Apache 2.0), Muse Spark Open 816B (Meta, licence restrictive), Nemotron 3 (NVIDIA), Granite 4.2 (IBM) — §2.
3. **Pour un poste de travail (16–32 Go)**, les modèles « sweet spot » fin 2026 sont **Qwen3.8‑27B** (dense, vision, Apache 2.0, ~16–19 Go en 4 bits), **Gemma 4 26B‑A4B** (MoE, 3,8B actifs, ~16–18 Go), **gpt‑oss‑20b** (~12–16 Go) et **Qwen3.6‑35B‑A3B** (~23 Go) — source Pinggy, oct. 2026, §2.7.
4. **Règle de dimensionnement** : `Go ≈ paramètres (B) × bits ÷ 8 × 1,1` + KV cache. Un 8B tient en 4 bits dans ~5,5 Go, un 70B en 4 bits exige ~41 Go — §3.1.
5. **La vitesse de génération est bornée par la bande passante mémoire**, pas par le calcul : M4 Max 546 Go/s ≈ 83 tok/s sur un 7B Q4, RTX 5090 1 792 Go/s ≈ 145 tok/s sur un 8B Q4, DGX Spark 273 Go/s ≈ 38 tok/s sur le même 8B — §3.3–3.5.
6. **Le DGX Spark (128 Go, GB10)** coûte 3 999 $ au lancement (oct. 2025), 4 699 $ en février 2026 et ~6 950 $ en octobre 2026 selon ServeTheHome ; il fait tourner jusqu'à 200B paramètres mais décode lentement (gpt‑oss‑120b ≈ 38–60 tok/s ; Llama 70B FP8 ≈ 2,7–4,7 tok/s) — §3.5.
7. **Le cloud GPU reste bon marché à l'heure** : H100 de 1,49 $ (Vast.ai) à 2,99 $ (RunPod Secure) ; RTX 4090 0,34 $/h ; Scaleway H100 PCIe 2,73 €/h, L40S 1,40 €/h ; OVHcloud H100 2,80 €/h — §3.7.
8. **Fine‑tuning accessible** via LoRA/QLoRA avec Unsloth (« 2× plus rapide, 70 % de VRAM en moins »), Axolotl, HF PEFT/TRL — §4.
9. **Frameworks d'agents** : LangChain 1.4.x / LangGraph 1.2 (mai–oct. 2026), Microsoft Agent Framework 1.0 (3 avril 2026, remplace AutoGen + Semantic Kernel), OpenAI Agents SDK, Claude Agent SDK, Google ADK ; **MCP** spec stable 2026‑07‑28 ; **A2A** 1.0 (avril 2026) puis 1.2, 150+ organisations — §5.
10. **Agents de code** : Claude Code, Codex CLI (Apache 2.0), Gemini CLI (Apache 2.0), Cursor, Windsurf (racheté par Cognition), Aider, Cline, Copilot ; « vibe coding » = mot de l'année Collins 2025 ; « Agent Skills » (SKILL.md) = standard ouvert agentskills.io — §5.4–5.6.
11. **Sécurité** : l'OWASP a publié le **Top 10 for LLM Applications 2026 le 4 août 2026** (Prompt Injection toujours n°1 ; Excessive Agency monte au n°3 ; « System Prompt Leakage » devient « Hidden Context Exposure ») et un **Top 10 for Agentic Applications** — §7.
12. **Évaluation** : LMArena (Elo), Artificial Analysis Intelligence Index (v5 depuis le 27 oct. 2026, 60 % de tests privés), Open LLM Leaderboard v3 (HF, janv. 2026) ; outils promptfoo (racheté par OpenAI, mars 2026), DeepEval, Ragas, Inspect AI, Langfuse (racheté par ClickHouse, janv. 2026) — §6.

---

## 1. Outils pour faire tourner un LLM en local

### 1.1 Tableau récapitulatif

| Outil | Rôle | OS | Licence | Installation | Télécharger un modèle | URL officielle |
|---|---|---|---|---|---|---|
| **Ollama** | Serveur + CLI « docker-like » pour LLM ; API REST compatible OpenAI et Anthropic | macOS, Windows, Linux (Docker dispo) | MIT (source : Pinggy, oct. 2026) | Linux : `curl -fsSL https://ollama.com/install.sh \| sh` ; macOS/Windows : installeur | `ollama pull <modèle>` ou `ollama run <modèle>` ; catalogue sur ollama.com/search | https://docs.ollama.com **[vérifiée]** ; https://ollama.com/download **[vérifiée]** ; https://ollama.com/search **[vérifiée]** |
| **LM Studio** | Application graphique (chat, découverte de modèles HF, serveur local, CLI `lms`) | macOS (Apple Silicon, moteurs MLX + llama.cpp), Windows, Linux | Gratuit, **code fermé** (source : Pinggy) | Téléchargement sur lmstudio.ai | Onglet « Discover » : recherche Hugging Face intégrée (GGUF / MLX) | https://www.lmstudio.ai/docs **[vérifiée]** ; guide : https://www.thundercompute.com/blog/lm-studio-local-llm **[vérifiée]** |
| **llama.cpp** | Moteur C/C++ de référence, format **GGUF**, backends CPU / CUDA / Metal / Vulkan / ROCm ; binaire `llama-server` (API OpenAI) et `llama-bench` | macOS, Windows, Linux, Android | MIT | Binaires GitHub Releases, Homebrew, ou `cmake` | Fichiers `.gguf` depuis Hugging Face (ex. collections ggml-org, bartowski, unsloth) ; `llama-cli -hf <org/modèle>` | Dépôt : https://github.com/ggml-org/llama.cpp **[non re-vérifiée, mais la discussion #4167 du même dépôt a été ouverte]** ; discussion perf : https://github.com/ggml-org/llama.cpp/discussions/4167 **[vérifiée]** |
| **vLLM** | Serveur d'inférence haute performance (PagedAttention, batching continu) pour GPU ; API OpenAI | Linux (CUDA, ROCm, Intel GPU, TPU, Ascend, Apple Silicon expérimental) ; Python 3.11–3.14 | Apache 2.0 | `uv pip install vllm --torch-backend=auto` puis `vllm serve <modèle HF>` → http://localhost:8000/v1 | Téléchargement automatique depuis Hugging Face à la première exécution | https://docs.vllm.ai/en/latest/getting_started/quickstart/ **[vérifiée]** |
| **text-generation-webui** (« oobabooga », renommé **TextGen**) | Interface web Gradio multi-backends (llama.cpp, Transformers, ExLlama) | Windows (`textgen.bat`), Linux/macOS (`./textgen`) | AGPL‑3.0 (source : Pinggy) | Scripts one-click | Onglet « Model » → téléchargement HF | https://github.com/oobabooga/text-generation-webui **[vérifiée]** |
| **Jan** | Application de bureau open source type ChatGPT, 100 % hors ligne, serveur local OpenAI | Windows, macOS, Linux | Apache 2.0 (source : Pinggy) | Installeur jan.ai | « Hub » de modèles intégré (GGUF) | https://jan.ai **[vérifiée]** ; dépôt : https://github.com/janhq/jan **[vérifiée]** |
| **GPT4All** (Nomic) | Application de bureau grand public, orientée CPU, « LocalDocs » (RAG local) | Windows, macOS, Linux | MIT (appli) | Installeur | Catalogue intégré | Actualité v3.0 : https://alternativeto.net/news/2024/7/nomic-releases-gpt4all-3-0-its-open-source-local-llm-desktop-app-with-new-redesign-and-more **[vérifiée]** ; dépôt officiel https://github.com/nomic-ai/gpt4all **[non re-vérifiée]** |
| **MLX / mlx-lm** (Apple) | Framework de calcul Apple Silicon ; `mlx_lm.generate`, `mlx_lm.server` ; quantification 4/8 bits native | macOS (Apple Silicon uniquement) | MIT | `pip install mlx-lm` | Modèles au format MLX sur HF (organisation `mlx-community`) | Article Apple M5 : https://machinelearning.apple.com/research/exploring-llms-mlx-m5 **[vérifiée]** ; dépôt https://github.com/ml-explore/mlx-lm **[non re-vérifiée]** |
| **Open WebUI** | Interface web « ChatGPT-like » auto-hébergée (multi-utilisateurs, RAG, outils, MCP) au-dessus d'Ollama / API OpenAI | Docker (toutes plateformes), pip | Licence Open WebUI (BSD‑3 modifiée avec clause de marque depuis 2025 — à vérifier dans le dépôt) | `docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main` → port 8080 | Via Ollama ou connexion API | Doc : https://docs.openwebui.com/getting-started/quick-start/ **[vérifiée]** ; tutoriel : https://www.thomas-krenn.com/en/wiki/Installation_of_Open_WebUI_with_Ollama **[vérifiée]** |
| **LocalAI** | « OpenAI drop-in » auto-hébergé : LLM, images, audio, embeddings, API compatible | Docker (CPU ou GPU NVIDIA), binaire | MIT (source : Pinggy) | `docker run` image localai | Galerie intégrée | https://localai.io **[vérifiée]** ; explication : https://www.promptquorum.com/power-local-llm/localai-explained **[vérifiée]** |
| **KoboldCpp** | « One File. Zero Install. » : exécutable unique basé sur llama.cpp, UI Kobold Lite, image/voix, API OpenAI + KoboldAI (port 5001) | Windows (`koboldcpp.exe`), Linux (`koboldcpp-linux-x64`), macOS ARM64, Android (Termux) | AGPL‑3.0 (selon le dépôt — la wiki ne la précise pas) | Télécharger le binaire, `chmod +x`, lancer | Charger un `.gguf` | https://github.com/LostRuins/koboldcpp/wiki **[vérifiée]** |
| **exo** (exo labs) | Cluster d'inférence sur appareils hétérogènes (Mac, PC NVIDIA, Raspberry Pi) ; « experimental software » | macOS (MLX), Linux (tinygrad), CPU | GPL v3 | `git clone` + `pip install -e .` (Python ≥ 3.12) | Modèles Llama, Mistral, Qwen, DeepSeek, LLaVA | https://github.com/exo-explore/exo **[vérifiée]** — dernier commit vu : 21 mars 2025 (projet peu actif) |
| **Unsloth Studio / Desktop** | Nouveau (2026) : application de bureau pour exécuter ET fine-tuner (500+ modèles) | macOS, Windows, Linux | Apache 2.0 (cœur), AGPL‑3.0 (interface Studio) | `curl -fsSL https://unsloth.ai/install.sh \| sh`, Homebrew, WinGet, Docker `unsloth/unsloth` | Intégré | https://unsloth.ai/docs **[vérifiée]** |

Sources de synthèse : Pinggy, « Best Local LLM Tools and Models in 2026 » (mis à jour 5 oct. 2026) https://pinggy.io/blog/top_5_local_llm_tools_and_models/ **[vérifiée]**.

### 1.2 Ollama — commandes à enseigner (source : https://kx.cloudingenium.com/en/ollama-local-llm-run-large-language-models-machine-guide/ **[vérifiée]**, complété par docs.ollama.com)

```bash
curl -fsSL https://ollama.com/install.sh | sh   # Linux
ollama run qwen3.8:27b        # télécharge si besoin puis ouvre un chat
ollama pull gemma4:26b        # télécharge seulement
ollama list                   # modèles installés
ollama ps                     # modèles chargés en mémoire
ollama rm <modèle>            # supprime
ollama serve                  # démarre le serveur (port 11434)
ollama create mon-modele -f Modelfile   # modèle personnalisé (system prompt, température...)
```

- API REST : `http://localhost:11434/api/generate`, `/api/chat` ; endpoints compatibles OpenAI `http://localhost:11434/v1/...` et désormais compatibles clients Anthropic (docs.ollama.com, 2026).
- Bibliothèques officielles Python et JavaScript (docs.ollama.com).
- Ollama propose depuis 2025 des « modèles cloud » (exécutés chez Ollama) en plus des modèles locaux — à signaler aux apprenants pour éviter les confusions sur la confidentialité (docs.ollama.com).
- Ordres de grandeur mémoire cités par le guide : 7B → 8 Go de RAM minimum, 13B → 16 Go, 70B → 64 Go (ou GPU avec VRAM suffisante).

### 1.3 LM Studio — points pédagogiques

- Moteurs : **llama.cpp** (GGUF) sur toutes plateformes, **MLX** sur Apple Silicon (source : Pinggy ; doc lmstudio.ai/docs).
- Serveur local compatible OpenAI (par défaut `http://localhost:1234/v1`) et CLI `lms` **[d'après la documentation LM Studio connue — page détaillée non ré-ouverte]**.
- Gratuit, code fermé ; usage en entreprise autorisé depuis 2025 selon les conditions LM Studio **[à vérifier sur lmstudio.ai avant diffusion]**.

### 1.4 Quel outil pour quel public ?

| Profil | Recommandation | Pourquoi |
|---|---|---|
| Débutant non technique | LM Studio ou Jan | GUI, découverte de modèles intégrée, zéro terminal |
| Développeur | Ollama + Open WebUI | Scriptable, API OpenAI, Docker |
| Mac Apple Silicon « power user » | LM Studio (MLX) ou mlx-lm | MLX exploite les Neural Accelerators M5 (Apple, nov. 2025) |
| Serveur multi-utilisateurs / production | vLLM (GPU) | Batching continu : 289–313 tok/s agrégés sur DGX Spark avec 8 requêtes simultanées vs. aucun gain avec Ollama (Spheron, oct. 2026) |
| Matériel très limité / portable | llama.cpp ou KoboldCpp | Binaire unique, CPU/Vulkan |

---

## 2. Les meilleurs modèles à poids ouverts (état au 1er novembre 2026)

### 2.1 Sources de classement

| Classement | Ce qu'il mesure | URL |
|---|---|---|
| **LMArena** (ex-Chatbot Arena) | Elo issu de votes humains en aveugle (Text, Vision, WebDev, etc.) | Site officiel : https://lmarena.ai **[non re-vérifiée]** ; relevé tiers du 31 oct. 2026 : https://www.swfte.com/lmarena **[vérifiée]** |
| **Artificial Analysis Intelligence Index** | Indice composite (v5 depuis le 27 oct. 2026 : 60 % de tests privés ; 4 familles à 25 % : travail intellectuel, code, science, culture générale) | https://artificialanalysis.ai/leaderboards/models **[vérifiée via article AA]** ; article open weights 30 avr. 2026 : https://www.artificialanalysis.ai/articles/recent-open-weights-model-launches **[vérifiée]** ; GLM‑5.2 leader (16 juin 2026) : https://artificialanalysis.ai/articles/glm-5-2-is-the-new-leading-open-weights-model-on-the-artificial-analysis-intelligence-index **[vérifiée]** ; index v5 : https://www.actuia.com/en/news/mistral-large-4-drops-from-38-to-25-on-new-artificial-analysis-index/ **[vérifiée]** |
| **Open LLM Leaderboard v3** (Hugging Face) | Refonte annoncée le 12 janv. 2026 : raisonnement, suivi d'instructions, tâches réelles (l'ancienne v2 avait été gelée en 2025) | https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard_v3 **[URL citée par la source]** ; annonce : https://news.ainauten.com/en/story/huggingface-open-llm-leaderboard-v3 **[vérifiée]** |
| Synthèses éditoriales | Tableaux comparatifs | Morph (mis à jour 26 oct. 2026) : https://www.morphllm.com/best-open-source-llm **[vérifiée]** ; HF blog (13 mai 2026) : https://huggingface.co/blog/daya-shankar/open-source-llm-models-to-run-locally **[vérifiée]** ; HF blog (13 nov. 2025) : https://huggingface.co/blog/daya-shankar/open-source-llms **[vérifiée]** |

**Repères chiffrés (à citer en cours)**
- LMArena, relevé Swfte du 31 oct. 2026 : top fermé Claude Mythos 5 (1531), Claude Fable 5 (1525), Claude Opus 5 (1522), GPT‑5.6 Sol (1514) ; **meilleurs ouverts** : Kimi K3 (1500), Qwen3.8 Max (1491, texte seul en poids ouverts), GLM‑5.2 (1483), GLM‑5.1 (1467), DeepSeek V4 Pro (1461), MiniMax M3 (1455).
- Artificial Analysis v5 (27 oct. 2026) : Claude Opus 5.5 = 58, GPT‑6 Astra = 57 ; meilleurs **poids publiés** : DeepSeek V4.1 Flash et GLM‑5.3 = 32 ; Mistral Large 4 = 25 ; Muse Spark Open = 25 ; Kimi K3.1 Pro (poids annoncés pour le 4 nov. 2026) = 46. Écart ouvert/fermé = 26 points sur poids publiés (ActuIA).
- Pour mémoire, un an plus tôt (AA, 30 avr. 2026, index v4) : Kimi K2.6 et MiMo V2.5 Pro = 54, DeepSeek V4 Pro = 52, contre GPT‑5.5 = 60 ; en avril 2025 le meilleur ouvert (DeepSeek V3 0324) était à 22.

### 2.2 Tableau par taille — modèles recommandés

Les colonnes « contexte », « licence » et « points forts » sont celles des sources citées. Les scores sont majoritairement auto-déclarés par les éditeurs (avertissement repris de Morph).

#### ≤ 4B (téléphone, Raspberry Pi, CPU, 8 Go de RAM)

| Modèle | Paramètres | Contexte | Licence | Points forts | Source / URL |
|---|---|---|---|---|---|
| **Gemma 4 E2B / E4B** (Google, 2 avr. 2026) | 2,3B / 4,5B effectifs | 128K | Apache 2.0 | Texte + image + audio ; conçus pour l'embarqué (LiteRT) | https://datanorth.ai/news/google-releases-gemma-4-open-models **[vérifiée]** ; https://deepmind.google/models/gemma/gemma-4/ **[URL citée]** ; https://ai.google.dev/edge/litert-lm/models/gemma-4 **[vérifiée]** |
| **Phi‑4‑mini‑instruct** (Microsoft) | 3,8B | 128K | MIT | Tourne sur CPU ; faibles ressources | https://huggingface.co/microsoft/Phi-4-mini-instruct **[URL citée par HF blog]** |
| **Granite 4.2 3B** (IBM, 25 août 2026) | ~3–4B | 131K (extensible 512K selon IBM) | Apache 2.0 | Raisonnement, entreprise, dispo sur Ollama | https://datanorth.ai/news/ibm-releases-granite-4-2 **[vérifiée]** ; https://research.ibm.com/blog/introducing-granite-4-2 **[URL citée]** |
| **Ministral 3 — 3B** (Mistral, déc. 2025) | 3B dense | n.p. | Apache 2.0 | Multilingue (français natif), edge | https://serenitiesai.com/articles/mistral-ai-models-2026-complete-guide **[vérifiée]** |
| **SmolLM3‑3B** (Hugging Face, juil. 2025) | 3B | 64K (128K extrapolé) | Apache 2.0 | « Fully open » (données + recettes publiées), 6 langues dont le français, mode raisonnement | https://www.kdnuggets.com/small-language-models-with-hugging-face-transformers-library-smollm3 **[vérifiée]** |

#### 7–9B (portable 16 Go, RTX 3060 12 Go)

| Modèle | Paramètres | Contexte | Licence | Points forts | Source / URL |
|---|---|---|---|---|---|
| **Granite 4.2 8B** (IBM) | ~8–9B | 131K | Apache 2.0 | Raisonnement, outils, entreprise | idem ci-dessus |
| **Ministral 3 — 8B** (Mistral) | 8B dense | n.p. | Apache 2.0 | Français, function calling | Serenities AI **[vérifiée]** |
| **Qwen3‑8B** (Alibaba, 2025) | 8B | 128K | Apache 2.0 | Référence 2025 ; 4 bits = 5,6 Go (Apple MLX) | https://machinelearning.apple.com/research/exploring-llms-mlx-m5 **[vérifiée]** |
| **Llama 3.1 8B** (Meta) | 8B | 128K | Llama 3.1 Community | Encore utilisé dans tous les benchmarks matériels 2026 | https://en.wikipedia.org/wiki/Llama_(language_model) **[vérifiée]** |
| **DeepSeek‑R1‑Distill (1,5B–70B)** | distillats Qwen/Llama | 128K | MIT (+ licences bases) | Raisonnement « chain-of-thought » compact | https://huggingface.co/deepseek-ai/DeepSeek-R1 **[URL citée par HF blog]** |

> Note : la famille **Qwen3.8** (août 2026) comprend des tailles inférieures au 27B (variantes dense et MoE) mais seules les fiches 27B, Flash‑Next (125B‑A6B) et 2,4T‑A95B ont pu être vérifiées dans cette session — consulter https://qwen.ai/blog?id=qwen3.8 **[URL citée par la model card]**.

#### 12–15B (16–24 Go)

| Modèle | Paramètres | Contexte | Licence | Points forts | Source / URL |
|---|---|---|---|---|---|
| **Gemma 4 12B** (Google) | 12B dense | 256K | Apache 2.0 | 7–8 Go en 4 bits ; recommandé pour portable 16 Go (Pinggy, oct. 2026) | https://pinggy.io/blog/top_5_local_llm_tools_and_models/ **[vérifiée]** ; Morph liste aussi un 12B **[vérifiée]** — *DataNorth n'énumère que E2B/E4B/26B/31B : vérifier la fiche HF avant le cours* |
| **Phi‑4‑reasoning‑vision‑15B** (Microsoft, mars 2026) | 15B | n.p. | MIT | Vision + raisonnement « à la demande » | https://en.wikipedia.org/wiki/Phi_(language_model) **[vérifiée]** |
| **Phi‑4‑reasoning** (14B) | 14B | n.p. | MIT | Maths, sciences, code | https://huggingface.co/microsoft/Phi-4-reasoning **[URL citée par HF blog]** |
| **Ministral 3 — 14B** (Mistral) | 14B dense | n.p. | Apache 2.0 | Français | Serenities AI **[vérifiée]** |
| **Qwen3‑14B** | 14B | 128K | Apache 2.0 | 4 bits ≈ 9,2 Go (Apple MLX) | Apple **[vérifiée]** |

#### 20–35B (24–32 Go : RTX 4090/5090, Mac 32–48 Go)

| Modèle | Paramètres | Contexte | Licence | Points forts | Source / URL |
|---|---|---|---|---|---|
| **Qwen3.8‑27B** (Alibaba, août 2026) | 27B dense (28B selon HF) | 262K natif → 1M | Apache 2.0 | Vision-langage natif (image + vidéo), `reasoning_effort` ; Terminal‑Bench 2.1 = 73,0 ; SWE‑bench Pro = 61,7 ; GPQA Diamond = 89,2 ; LiveCodeBench v6 = 90,3 ; 1 600+ quantifications communautaires ; **« meilleur rapport qualité/Go »** (Pinggy) | https://huggingface.co/Qwen/Qwen3.8-27B **[vérifiée]** |
| **Gemma 4 26B‑A4B** (Google) | 25,2B / 3,8B actifs (MoE) | 256K | Apache 2.0 | Texte + image + vidéo 60 s ; 6e modèle ouvert sur Arena ; 16–18 Go en 4 bits | https://huggingface.co/google/gemma-4-26B-A4B-it **[URL citée par HF blog]** |
| **Gemma 4 31B** (Google) | 30,7B dense | 256K | Apache 2.0 | AIME 2026 = 89,2 % ; LiveCodeBench v6 = 80 % ; GPQA = 84,3 % ; MMLU Pro = 85,2 % ; ~1452 Elo, 3e ouvert sur Arena (avril 2026) | DataNorth **[vérifiée]** |
| **Granite 4.2 30B** (IBM) | ~29–30B | 131K | Apache 2.0 | Raisonnement, entreprise | DataNorth **[vérifiée]** |
| **gpt‑oss‑20b** (OpenAI, 5 août 2025) | 20,9B / 3,6B actifs (MoE) | 128K | Apache 2.0 | Tourne en 16 Go ; MMLU 85,3 ; GPQA 74,2 ; SWE‑bench Verified 60,7 ; AIME 2025 (outils) 98,7 ; MXFP4 ≈ 12 Go | https://www.morphllm.com/gpt-oss **[vérifiée]** |
| **Qwen3.6‑35B‑A3B** / **Qwen3.6‑27B** (2026) | 35B / 3B actifs ; 27B dense | 131K | Apache 2.0 | SWE‑bench Verified 73,4 % / 77,2 % ; 35B‑A3B ≈ 23 Go en 4 bits, « meilleur polyvalent 32 Go » (Pinggy) | Morph **[vérifiée]** ; Pinggy **[vérifiée]** |
| **Mistral Small 3.1 / 3.2 (24B)** et **Devstral (24B)** | 24B dense | 128K | Apache 2.0 | Multimodal, multilingue (français), function calling ; Devstral = agents de code (SWE) | https://mistral.ai/en/news/mistral-small-3-1 et https://mistral.ai/en/news/devstral **[URL citées par HF blog]** ; Devstral 2 + Vibe CLI : https://mistral.ai/news/devstral-2-vibe-cli/ **[vérifiée]** |
| **Muse Glimmer‑30B** (Meta, 2026) | 30B | n.p. | n.p. | SWE‑bench Pro 51,2 % (chiffre Qwen) | Morph **[vérifiée]** |

#### 70B+ denses et MoE « serveur » (≥ 64 Go)

| Modèle | Paramètres | Contexte | Licence | Points forts | Source / URL |
|---|---|---|---|---|---|
| **Mistral Small 4** (16 mars 2026) | 119B / 6B actifs (128 experts, 4 actifs) | 256K | Apache 2.0 | Fusionne Magistral (raisonnement), Devstral (code) et Pixtral (vision) ; `reasoning_effort` | https://mistral.ai/news/mistral-small-4/ **[vérifiée]** ; https://huggingface.co/collections/mistralai/mistral-small-4 **[URL citée]** |
| **gpt‑oss‑120b** (OpenAI) | 116,8B / 5,1B actifs | 128K | Apache 2.0 | 1 GPU 80 Go ou ~66 Go en MXFP4 ; MMLU 90,0 ; GPQA 80,9 ; SWE‑bench Verified 62,4 ; Codeforces 2622 | Morph gpt‑oss **[vérifiée]** |
| **Qwen3.8‑Flash‑Next** | 125B / 6B actifs | n.p. | Qwen Community License 1.0 | SWE‑bench Pro 62,5 % ; 96–114 Go en 4 bits (Pinggy) | https://huggingface.co/Qwen/Qwen3.8-Flash-Next **[URL citée par Morph]** |
| **Llama 4 Scout / Maverick** (Meta, 5 avr. 2025) | 109B/17B actifs ; 400B/17B actifs | 10M / 1M | Llama 4 Community License (non OSI) | Contexte extrême ; Behemoth jamais publié ; Llama est supplanté par Muse chez Meta depuis avril 2026 | Wikipédia **[vérifiée]** ; https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E **[URL citée]** |
| **Nemotron 3 Super / Ultra** (NVIDIA, 2026) | Ultra : 550B / 55B actifs | 256K (1M via config) | OpenMDW‑1.1 | SWE‑bench Verified 70,7 % ; Super ≈ 64–72 Go en 4 bits ; meilleur ouvert non chinois avec Gemma 4 (AA, avril 2026) | https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16 **[URL citée par Morph]** |
| **DeepSeek‑V4‑Flash** (2026) | 284B / 13B actifs | 1M | MIT | 3 bits ≈ 110–135 Go (plafond d'un 128 Go) | Morph **[vérifiée]** ; Pinggy **[vérifiée]** |
| **GLM‑5.3‑Flash** (Z.ai, 26 août 2026) | 320B / 18B actifs | 1M | MIT | Agents, code | https://www.llmreference.com/model/glm-5.3-flash/z-ai **[vérifiée]** ; https://huggingface.co/zai-org/GLM-5.3-Flash **[URL citée]** |
| **Mistral Large 3** (2 déc. 2025) | 675B / 41B actifs | 256K | Apache 2.0 | Premier « frontier » européen Apache 2.0 | Serenities AI **[vérifiée]** |
| **Beam** (Reflection AI) | 501B / 23B actifs | 1M | Apache 2.0 | SWE‑bench Verified 81,6 % ; SWE‑bench Pro 66,1 % | https://huggingface.co/blog/reflection-beam **[URL citée par Morph]** |

#### Frontière ouverte (clusters multi-GPU uniquement)

| Modèle | Paramètres | Contexte | Licence | Repères | Source / URL |
|---|---|---|---|---|---|
| **Kimi K3** (Moonshot, annoncé 16–17 juil. 2026, poids le 27 juil. 2026) | **2,8T / 104B actifs** (896 experts, 16 actifs) | 1M, vision native | « Kimi K3 License » (accord requis > 20 M$ de revenus ; mention « Kimi K3 » > 100 M MAU) | 1,56 To sur disque, ~1,4 To de mémoire en MXFP4 → cluster ≥ 64 accélérateurs ; AA Index 57 (4e/189, juil. 2026) ; Terminal‑Bench 2.1 = 88,3 ; GPQA Diamond = 93,5 | https://rits.shanghai.nyu.edu/ai/kimi-k3-open-weights-ship-2-8t-parameters-1-4-tb-to-run/ **[vérifiée]** ; https://pureai.com/articles/2026/07/17/china-moonshot-ai-releases-kimi-k3.aspx **[vérifiée]** ; https://huggingface.co/moonshotai/Kimi-K3 **[URL citée]** ; K3.1 Pro (API 23 oct. 2026, poids prévus 4 nov. 2026) : https://letsdatascience.com/news/moonshot-releases-kimi-k31-pro-api-open-weights-due-nov-4-786e160c **[vérifiée]** |
| **DeepSeek‑V4.1‑Flash** (10 sept. 2026 ; « 1017 » le 17 oct. 2026) | 552B / 8B (prefill) – 16B (decode) actifs | 1M (sortie 384K) | MIT | Terminal‑Bench 2.1 = 90,6 ; Codeforces 3471 ; GPQA 90,9 ; HLE 36,8 (63,9 avec outils) ; LMArena 1476 | https://www.llmreference.com/model/deepseek-v4.1-flash **[vérifiée]** ; https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash **[URL citée]** |
| **DeepSeek‑V4‑Pro** (2026) | 1,6T / 49B actifs | 1M | MIT | SWE‑bench Verified 80,6 % ; AA 52 (avril 2026) | https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro **[URL citée par HF blog]** |
| **GLM‑5.3 / GLM‑5.2** (Z.ai) | 753B (5.3) ; 744B / 40B actifs (5.2) | 1M | GLM‑5.3 License / MIT (5.2) | GLM‑5.2 : AA 51 (16 juin 2026), SWE‑bench Pro 62,1 %, AIME 2026 99,2 | Artificial Analysis **[vérifiée]** ; Morph **[vérifiée]** |
| **Qwen3.8‑2.4T‑A95B** (« Qwen3.8‑Max ») | 2,4T / 95B actifs | 262K → ~1M | Licence Qwen3.8‑Max (personnalisée) | Terminal‑Bench 2.1 = 86,6 ; SWE‑bench Pro 67,7 % ; LMArena 1491 (texte seul en open weights) | https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B **[URL citée par Morph]** |
| **Muse Spark Open** (Meta, 15 oct. 2026) | 816B / 42B actifs | 1M | « Muse Model License » : accord écrit obligatoire pour offrir le modèle en MaaS au-delà de 20 M$ de CA ; mention « Built with Muse Spark Open » ; interdictions militaires (sauf gouvernement US) | Texte, image, audio, vidéo en entrée ; AA v5 = 25 | https://thenewstack.io/meta-muse-spark-open/ **[vérifiée]** ; https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B **[URL citée]** |
| **Kimi K2.7 Code / Kimi K2.6** | 1T / 32B actifs | 256K | Modified MIT | Code agentique | https://huggingface.co/moonshotai/Kimi-K2.7-Code **[URL citée par Morph]** ; https://huggingface.co/moonshotai/Kimi-K2.6 **[URL citée par HF blog]** |
| **MiniMax M3** | 428B / 23B actifs | 1M | MiniMax Community License | SWE‑bench Pro 59 % | Morph **[vérifiée]** |
| **Mistral Large 4** (poids annoncés « fin octobre 2026 », non publiés au 28 oct. 2026) | nom du dépôt : 1T‑A52B (inférence) | n.p. | inconnue | AA v5 = 25 | ActuIA **[vérifiée]** |

### 2.3 Lecture des licences (point de cours indispensable)

| Famille de licence | Exemples | Usage commercial | Pièges |
|---|---|---|---|
| **Apache 2.0 / MIT** (OSI) | Qwen3.8‑27B, Gemma 4, gpt‑oss, Mistral Small 4 / Large 3, DeepSeek (MIT), GLM‑5.2/5.3‑Flash (MIT), Granite, SmolLM3, Phi | Libre | Aucun (hors marques) |
| **Licences communautaires « semi-ouvertes »** | Llama 4 Community, Muse Model License, Kimi K3 License, Qwen3.8‑Max, GLM‑5.3, MiniMax Community | Oui mais seuils de revenus (20 M$ pour Muse/Kimi K3), obligation de mention, usages interdits | Non reconnues « open source » par l'OSI (Wikipédia Llama) |
| **Non commerciales** | Cohere Command A (CC‑BY‑NC), Voxtral TTS (CC BY‑NC 4.0) | Non | Interdit en production commerciale |

Sources : Morph **[vérifiée]**, The New Stack **[vérifiée]**, NYU Shanghai RITS **[vérifiée]**, Serenities AI **[vérifiée]**.

### 2.4 Multilingue / français
- Gemma 3 revendiquait 140+ langues, Qwen3 100+ langues (HF blog, mai 2026 **[vérifiée]**) ; Gemma 4 et Qwen3.8 héritent de cette couverture (fiches à citer).
- Mistral (Paris) reste le choix « souverain » : Ministral 3 (3/8/14B), Small 4, Large 3, tous Apache 2.0 (Serenities AI **[vérifiée]**).
- Pour les tests de la formation : le banc Bestllmfor (12 sept. 2026) évalue des modèles 8–12B sur un exercice de code en français et des documents français — qwen3:8b et mistral-nemo:12b réussissent, hermes3:8b échoue malgré sa vitesse (https://bestllmfor.com/benchmarks/ **[vérifiée]**).

### 2.5 Vision / multimodal local
- Qwen3.8‑27B : image + vidéo natifs (OSWorld‑Verified 84,3 ; OmniDocBench 91,1) **[vérifiée]**.
- Gemma 4 : texte/image/audio (tous), + vidéo 60 s (26B, 31B) **[vérifiée]**.
- Phi‑4‑reasoning‑vision‑15B (MIT) **[vérifiée]**.
- Muse Spark Open : texte, image, audio, vidéo en entrée **[vérifiée]**.

### 2.6 Code
- Classement SWE‑bench Verified cité par Morph (oct. 2026) : Beam 81,6 % ; DeepSeek‑V4‑Pro 80,6 % ; Qwen3.6‑27B 77,2 % ; Qwen3.5‑397B‑A17B 76,2 % ; Nemotron 3 Ultra 70,7 % ; Qwen3‑Coder‑480B 66,5 % ; Kimi K2 65,8 % ; gpt‑oss‑120b 62,4 %.
- Terminal‑Bench 2.1 : DeepSeek‑V4.1‑Flash 90,6 ; Kimi K3 88,3 ; GLM‑5.3 88,2 ; Qwen3.8‑Max 86,6 ; Qwen3.8‑27B 73,0 (Morph **[vérifiée]**).
- Modèles « code » dédiés : Devstral 2 / Mistral Vibe CLI (https://mistral.ai/news/devstral-2-vibe-cli/ **[vérifiée]**), Kimi K2.7 Code, Qwen3‑Coder‑Next (46 Go en 4 bits, Pinggy **[vérifiée]**).

### 2.7 Quel modèle pour quelle mémoire ? (Pinggy, mis à jour 5 oct. 2026, quantification 4 bits **[vérifiée]**)

| Mémoire disponible | Modèles recommandés | Taille approx. |
|---|---|---|
| 8 Go | Gemma 4 12B (serré) | 7–8 Go |
| 16 Go | Gemma 4 12B ; Gemma 4 26B‑A4B ; Qwen3.8‑27B | 7–8 / 16–18 / 16–19 Go |
| 32 Go | Qwen3.6‑35B‑A3B (meilleur polyvalent) ; Qwen3.8‑27B (meilleur rapport qualité/Go) | 23 / 16–19 Go |
| 64 Go | Qwen3‑Coder‑Next ; gpt‑oss‑120b (limite : ~66 Go) | 46 / 66 Go |
| 128 Go | gpt‑oss‑120b ; Nemotron 3 Super ; Qwen3.8‑Flash‑Next ; DeepSeek‑V4‑Flash en 3 bits | 66 / 64–72 / 96–114 / 110–135 Go |

---

## 3. Matériel : dimensionner et estimer la vitesse

### 3.1 Quantization — pourquoi c'est la clé du dimensionnement

- Un paramètre est un nombre. Stocké en **FP16/BF16** il occupe 2 octets ; en **Q8** 1 octet ; en **Q4** 0,5 octet. La quantization réduit la précision des poids (et parfois du KV cache) pour diviser la mémoire par 2 à 4, au prix d'une perte de qualité généralement faible jusqu'à Q4 (règle de calcul : Flavio Copes, https://flaviocopes.com/llm-vram-requirements/ **[vérifiée]**).
- Formats courants : **GGUF** (llama.cpp : Q4_K_M, Q5_K_M, Q6_K, Q8_0, IQ2/IQ3…), **MLX** 4/8 bits (Apple), **AWQ / GPTQ / FP8 / NVFP4 / MXFP4** (GPU, vLLM, TensorRT‑LLM). gpt‑oss est distribué nativement en **MXFP4** (Morph **[vérifiée]**).
- Les fichiers quantifiés réels pèsent un peu plus que la théorie (échelles, métadonnées) ; prévoir **× 1,1** d'overhead runtime (Flavio Copes **[vérifiée]**).

**Formule à enseigner**

```
Mémoire poids (Go) ≈ Paramètres (milliards) × bits ÷ 8 × 1,1
KV cache (octets)  = 2 × couches × têtes_KV × dim_tête × tokens_contexte × octets_par_valeur
```
Exemples Llama 3 (KV en FP16) : 8B ≈ 131 Mo / 1 000 tokens (≈ 1,05 Go à 8K) ; 70B ≈ 328 Mo / 1 000 tokens (≈ 2,6 Go à 8K). Mémoire utilisable : ~90 % de la VRAM d'un GPU, ~70–75 % de la mémoire unifiée d'un Mac (Flavio Copes **[vérifiée]**). Calculateurs en ligne : https://inventivehq.com/tools/llm-vram-calculator **[vérifiée]**.

### 3.2 Tableau « paramètres → mémoire → disque » (calcul avec la formule ci-dessus, overhead 1,1 inclus, hors KV cache)

| Paramètres | FP16 (RAM/VRAM) | Q8 | Q4 | Disque Q4 (GGUF) | Matériel minimal confortable (Q4, contexte 8K) |
|---|---|---|---|---|---|
| 3–4B | 7–9 Go | 3,5–4,5 Go | 1,7–2,2 Go | ~2–2,5 Go | Tout PC 8 Go, téléphone haut de gamme |
| 8B | 17,6 Go | 8,8 Go | 4,4 Go (+1 Go KV = 5,5 Go) | ~4,9 Go | 8 Go VRAM / Mac 16 Go |
| 14B | 30,8 Go | 15,4 Go | 7,7 Go | ~8,5 Go | RTX 3060 12 Go (serré) / Mac 16 Go |
| 27B | 59 Go | 29,7 Go | 14,9 Go (Pinggy : 16–19 Go mesurés) | ~16 Go | RTX 4090 24 Go / Mac 32 Go |
| 32B | 70 Go | 35 Go | 17,6 Go | ~19 Go | 24 Go VRAM / Mac 32 Go |
| 70B | 154 Go | 77 Go | 38,5 Go (+2,6 Go KV ≈ 41 Go) | ~40 Go | 2× RTX 3090/4090, Mac 64 Go (serré), 96 Go (confort) |
| 120B MoE (gpt‑oss) | 257 Go | — | MXFP4 ≈ 66 Go (Pinggy) | ~63 Go | Mac 96–128 Go, DGX Spark, Strix Halo 128 Go |
| 235B MoE (Qwen3) | 517 Go | 258 Go | 129 Go | ~130 Go | 2× DGX Spark, Mac Studio 256 Go, serveur |
| 671B MoE (DeepSeek R1/V3) | 1,48 To | 738 Go | 369 Go | ~370 Go | Cluster multi-GPU |
| 2,8T MoE (Kimi K3) | 6,2 To | — | MXFP4 natif ≈ 1,4 To (NYU RITS) | 1,56 To | ≥ 64 accélérateurs |

Exemples mesurés (Apple MLX, nov. 2025 **[vérifiée]**) : Qwen3‑8B BF16 = 17,46 Go ; Qwen3‑8B 4 bits = 5,61 Go ; Qwen3‑14B 4 bits = 9,16 Go ; gpt‑oss‑20b MXFP4 = 12,08 Go ; Qwen3‑30B‑A3B 4 bits = 17,31 Go.

### 3.3 Mac Apple Silicon (mémoire unifiée)

Bande passante et tokens/s **llama.cpp, Llama 2 7B, Metal, batch 1** (discussion officielle llama.cpp #4167, instructions mises à jour le 25 août 2026 pour M5 ; les lignes M5/M6 sont sur un commit plus récent, donc non strictement comparables) — https://github.com/ggml-org/llama.cpp/discussions/4167 **[vérifiée]** :

| Puce (cœurs GPU) | Bande passante | Q4_0 génération (tok/s) | Q4_0 prefill (tok/s) | F16 génération (tok/s) |
|---|---|---|---|---|
| M1 (8) | 68 Go/s | 14,2 | 118 | n.d. |
| M1 Pro (16) | 200 Go/s | 36,4 | 266 | 12,8 |
| M1 Max (32) | 400 Go/s | 61,2 | 530 | 23,0 |
| M1 Ultra (64) | 800 Go/s | 83,7 | 1 030 | 37,0 |
| M2 (10) | 100 Go/s | 21,9 | 180 | 6,7 |
| M2 Pro (19) | 200 Go/s | 38,9 | 341 | 13,1 |
| M2 Max (38) | 400 Go/s | 66,0 | 671 | 24,7 |
| M2 Ultra (76) | 800 Go/s | 94,3 | 1 238 | 41,0 |
| M3 (10) | 100 Go/s | 21,3 | 187 | n.d. |
| M3 Pro (18) | 150 Go/s | 30,7 | 342 | 9,9 |
| M3 Max (40) | 400 Go/s | 66,3 | 760 | 25,1 |
| M3 Ultra (80) | 800 Go/s | 92,1 | 1 471 | 39,8 |
| M4 (10) | 120 Go/s | 24,1 | 221 | 7,4 |
| M4 Pro (20) | 273 Go/s | 50,7 | 440 | 17,2 |
| M4 Max (40) | 546 Go/s | 83,1 | 886 | 31,6 |
| M5 (10) | 154 Go/s | 31,9 | 723 | n.d. |
| M5 Pro (20) | 307 Go/s | 66,3 | 1 621 | 21,6 |
| M5 Max (40) | 614 Go/s | 119,9 | 3 220 | 37,1 |
| M5 Ultra (80) | 1 228 Go/s | 179,1 | 4 945 | 73,6 |

Points de cours :
- **La génération suit la bande passante** (M1 Max 400 Go/s ≈ 61 tok/s ; M5 Ultra 1 228 Go/s ≈ 179 tok/s). Le **prefill** (lecture du prompt) suit le calcul : les Neural Accelerators du M5 multiplient le prefill par ~4 (M5 Max : 3 220 vs 886 tok/s pour M4 Max).
- Apple (19 nov. 2025) : sur MacBook Pro M5 24 Go, TTFT jusqu'à 4× plus rapide que M4, génération +19 à +27 % ; un 8B BF16 ou un MoE 30B 4 bits tient dans < 18 Go (https://machinelearning.apple.com/research/exploring-llms-mlx-m5 **[vérifiée]**).
- Mémoire : 8 Go = modèles ≤ 4B ; 16 Go = 7–14B Q4 ; 32 Go = 27–35B Q4 ; 64 Go = 70B Q4 (serré) ; 96–128 Go = gpt‑oss‑120b, Nemotron 3 Super ; 256 Go (M3 Ultra) = gpt‑oss‑120b MXFP4 à 70,8 tok/s (IntuitionLabs/ServeTheHome **[vérifiée]**), Qwen3‑235B Q4.
- Mac Studio M5 Max : Qwen3.8‑27B ≈ 65–69 tok/s (MLX) ; M5 Ultra : Llama 3.1 70B ≈ 40–52 tok/s (communautaire) — https://presenc.ai/research/local-llm-tokens-per-second-benchmarks-2026 **[vérifiée]**.

### 3.4 PC avec GPU NVIDIA

Mesures llama-bench **Q4_K_XL, contexte 16K** (Hardware Corner via FormulaMod, avril 2026 — https://www.formulamod.net/blogs/new/which-nvidia-gpu-for-local-ai-in-2026-rtx-3090-vs-4060-ti-vs-4070-ti-super-vs-4090-vs-5090 **[vérifiée]**) complétées par Ajit Singh (RTX 3060, avril 2026 — https://singhajit.com/llm-inference-speed-comparison/ **[vérifiée]**) et Presenc (RTX 5090, oct. 2026 **[vérifiée]**) :

| GPU | VRAM | Bande passante | Qwen3 8B Q4 | Qwen3 14B Q4 | Autres repères | Prix indicatif |
|---|---|---|---|---|---|---|
| RTX 3060 12 Go | 12 Go GDDR6 | 360 Go/s | 42,0 tok/s (16K) ; 31,9 (32K) | 22,7 tok/s | Llama 2 7B Q4_K_M Vulkan 60,2 ; 13B 32,8 | 250–350 $ (Corelab) |
| RTX 4060 Ti 16 Go | 16 Go | 288 Go/s | 34 | 22 | — | ~399 $ |
| RTX 4070 (12 Go) | 12 Go GDDR6X | 504 Go/s | *pas de mesure publiée dans les sources consultées* (ordre de grandeur attendu entre 4060 Ti et 4070 Ti Super) | — | RTX 4070 Ti 12 Go : 18–28 tok/s (7B, estimation Corelab) | 550–700 $ (4070 Ti) |
| RTX 4070 Ti Super | 16 Go GDDR6X | 672 Go/s | 72 | 47 | — | ~799 $ |
| RTX 3090 (occasion) | 24 Go GDDR6X | 936 Go/s | 87 | 52 | 3× 3090 : gpt‑oss‑120b 124 tok/s | ~650–900 $ |
| RTX 4090 | 24 Go GDDR6X | 1 008 Go/s | 104 | 69 | 32B Q4 OK, 70B non | 1 500–2 000 $ |
| RTX 5090 | 32 Go GDDR7 | 1 792 Go/s | 145 | 103 | Llama 3.1 8B Q4_K_M 150 (Ollama) ; gpt‑oss‑20b 205 ; Gemma 3 27B Q4 47,3 ; Qwen3.8‑27B ≈ 59 ; 70B Q4 ne tient pas (≈ 38,5 Go) ; Llama 3.3 70B ≈ 27 tok/s sur **deux** cartes | ~1 999 $+ |
| RTX PRO 6000 Blackwell | 96 Go GDDR7 | ~1,8 To/s | — | — | gpt‑oss‑20b 215 tok/s ; prefill 10 108 tok/s (LMSYS via Kaitchup) ; fait tenir un 70B Q8 ou gpt‑oss‑120b sur une carte | ~8 000–10 000 $ **[prix non vérifié]** |

Sources complémentaires : Corelab « VRAM tier list » https://corelab.tech/llmgpu/ **[vérifiée]** ; ComputingForGeeks https://computingforgeeks.com/best-gpu-for-llm/ **[vérifiée]** ; Presenc RTX 5090 https://presenc.ai/research/rtx-5090-local-llm-benchmarks-2026 **[vérifiée]** ; Spheron DGX Spark vs 5090 https://www.spheron.network/blog/dgx-spark-vs-rtx-5090-for-local-llms-tokens-per-second-2026/ **[vérifiée]**.

Règle pratique : **la VRAM décide de ce qui tient, la bande passante décide de la vitesse**. Un modèle qui déborde en RAM système chute brutalement (déport CPU).

### 3.5 NVIDIA DGX Spark (GB10)

Fiche (IntuitionLabs, mis à jour 15 oct. 2026 — https://intuitionlabs.ai/articles/nvidia-dgx-spark-review **[vérifiée]** ; ServeTheHome https://www.servethehome.com/nvidia-dgx-spark-review-the-gb10-machine-is-so-freaking-cool/3/ **[vérifiée]**) :
- GPU GB10 Blackwell : 6 144 cœurs CUDA, 192 Tensor Cores 5e gén., ~1 PFLOPS FP4 sparse (~500 TFLOPS dense) ; CPU 20 cœurs Arm (10× X925 + 10× A725) ; **128 Go LPDDR5x unifiée, 273 Go/s** ; SSD 4 To ; 240 W.
- **Prix** : 3 999 $ (Founders Edition, oct. 2025) → 4 699 $ (fév. 2026, +18 % crise mémoire) → ~6 950 $ (oct. 2026, ServeTheHome). Version 64 Go OEM (Acer, ASUS, Dell, Gigabyte, HP, MSI) à partir de 4 999 $ dès le 23 oct. 2026.
- **Capacité** : jusqu'à 200B paramètres (FP4) sur un Spark ; 405B avec deux Spark reliés (LMSYS) ; fine-tuning jusqu'à 70B selon NVIDIA (Kaitchup conseille plutôt < 8B pour un confort réel — https://kaitchup.substack.com/p/dgx-spark-use-it-for-fine-tuning **[vérifiée]**).
- **Vitesses mesurées** (Spheron/LMSYS/llama.cpp #16578, oct. 2026 **[vérifiée]**) : gpt‑oss‑20b 49,7 tok/s (Ollama) à 60,9 (llama.cpp) ; **gpt‑oss‑120b 60,6 tok/s à contexte vide, 40,5 à 32K** (llama.cpp), 38,6 (IntuitionLabs) ; Llama 3.1 8B Q4_K_M 38 tok/s ; Llama 3.1 70B FP8 2,7 tok/s (SGLang) à 4,4–4,7 ; Gemma 3 27B Q4 10,8 ; prefill 7 991 tok/s (Llama 8B FP8) et 1 723 tok/s (gpt‑oss‑120b).
- **Verdict pédagogique** : machine « capacité » (gros MoE, contexte long, fine-tuning), pas « vitesse » : une RTX 5090 décode 4× plus vite sur ce qui tient dans 32 Go (Kaitchup, Spheron).

### 3.6 AMD, CPU seul, alternatives

- **AMD Ryzen AI Max+ 395 « Strix Halo » 128 Go** (bande passante théorique 256 Go/s, mesurée ~215 Go/s) : Llama 2 7B Q4 ≈ 46–53 tok/s (Vulkan) ; Qwen3‑30B‑A3B 72–75 tok/s ; **gpt‑oss‑120b MXFP4 31–34 tok/s** ; Llama 3 70B Q4 ≈ 5 tok/s. Machines (sept. 2026) : Framework Desktop 3 449 $, GMKtec EVO‑X2 3 649 $, Minisforum MS‑S1 Max 3 799 $, Beelink GTR9 Pro 4 349 $, HP Z2 Mini G1a 5 349–7 406 $ ; version 192 Go (Ryzen AI Max+ PRO 495) GMKtec Evo‑X5 7 099 $ — https://presenc.ai/research/amd-strix-halo-local-llm-benchmarks-2026 **[vérifiée]** ; article AMD : https://www.amd.com/en/developer/resources/technical-articles/2025/amd-ryzen-ai-max-395--a-leap-forward-in-generative-ai-performanc.html **[vérifiée]**. Comparaison directe : Spark 38,6 vs Strix Halo 34,1 tok/s sur gpt‑oss‑120b ; Spark 4,67 vs Strix 4,97 sur Llama 3.3 70B (IntuitionLabs **[vérifiée]**).
- **GPU AMD Radeon (ROCm/Vulkan)** : supportés par llama.cpp, Ollama, LM Studio, vLLM (ROCm) — docs vLLM **[vérifiée]** ; pas de benchmark consolidé trouvé dans cette session.
- **CPU seul** : ordre de grandeur « < 10 tok/s pour un 8B » sur CPU portable (Ajit Singh **[vérifiée]**, chiffre non sourcé) ; la bande passante DDR5 dual-channel (~80–100 Go/s) borne un 8B Q4 à ~15–20 tok/s au mieux (déduction de la règle bande passante ÷ taille du modèle). Les MoE à faibles paramètres actifs (Qwen3‑30B‑A3B, gpt‑oss‑20b) sont les seuls « gros » modèles agréables sur CPU.
- **Gigabyte AI TOP ATOM** (GB10, 128 Go) : série de mesures CC BY 4.0 publiée par Bestllmfor **[vérifiée]**.

### 3.7 Cloud GPU — prix indicatifs à l'heure (à actualiser à chaque session)

| Fournisseur | RTX 4090 | A100 80 Go | L40S 48 Go | H100 80 Go | B200 | Source (date) |
|---|---|---|---|---|---|---|
| **RunPod** Community / Secure | 0,34 $ / 0,69 $ | 1,19 $ / 1,39 $ | — | PCIe 1,99 $ / 2,89 $ ; SXM 2,69 $ / 2,99 $ | 5,89 $ | https://www.spheron.network/blog/gpu-cloud-pricing-comparison-runpod-vs-vastai-2026/ **[vérifiée]** (11 août 2026) |
| **Vast.ai** (marketplace) | 0,34–0,50 $ | 0,50–0,80 $ (spot dès 0,68 $) | — | ~0,90 $ (non vérifié) à 1,50–1,87 $ (datacenter) ; 1,49–2,27 $ (CloudZero) | sur devis | idem ; https://www.cloudzero.com/blog/cloud-gpu-pricing-comparison/ **[vérifiée]** (4 sept. 2026) |
| **Lambda** | — | — | — | 3,29–3,99 $ | 4,99 $ | CloudZero **[vérifiée]** |
| **Scaleway** (France, HT) | — | — | **1,40 €** (L40S‑1‑48G) ; L4 24 Go 0,75 € | **PCIe 2,73 €** ; SXM 2× 6,018 €, 8× 23,028 € | — | https://www.scaleway.com/en/pricing/gpu **[vérifiée]** |
| **OVHcloud** (France) | — | ~3,07 $ | ~1,69 $ | **2,80 €** (H100‑380) | — | https://www.spheron.network/blog/ovhcloud-gpu-pricing-2026-h100-cost-and-sovereign-ai/ **[vérifiée]** (27 juil. 2026) ; grille officielle https://ovhcloud.com/en/public-cloud/prices **[vérifiée]** |
| **Hyperscalers** (AWS / GCP / Azure) | — | GCP 5,03 $ | — | AWS ~6,88 $ ; GCP spot ~2,25 $ ; Azure ≤ 6,98 $ | AWS ~9,36 $ ; GCP ≤ 16,11 $ | CloudZero **[vérifiée]** |
| **CoreWeave** | — | 2,21–2,70 $ | — | 4,25–6,16 $ | ~5,50 $ | CloudZero **[vérifiée]** |

Médianes de marché H100 (CloudZero, sept. 2026) : 4,19 $ (clouds dédiés) vs 7,89 $ (hyperscalers) ; B200 : 7,88 $ vs 15,18 $.

**Exercice de cours (FinOps)** : 1 h de RTX 4090 à 0,34 $ = ~700 h pour le prix d'un DGX Spark à 4 699 $ ; un H100 Scaleway 2,73 €/h × 8 h/jour × 20 jours = 437 €/mois.

---

## 4. Notions fondamentales à expliquer (avec sources)

| Notion | Définition courte (pour le support) | Source |
|---|---|---|
| **Token / tokenizer** | Unité de texte (sous-mot) manipulée par le modèle ; le tokenizer (BPE, SentencePiece) découpe le texte. Ordre de grandeur : ~0,75 mot anglais par token, le français coûte ~1,3–1,5× plus de tokens que l'anglais. Le contexte, le prix API et la vitesse se comptent en tokens. | Tableaux de vitesse §3 (tok/s) ; model cards (contexte en tokens) |
| **Paramètres** | Nombre de poids du réseau (B/T) ; détermine la mémoire (§3.1) et, pour les MoE, distinguer total / actifs. | Morph **[vérifiée]** |
| **Context window** | Nombre max. de tokens (prompt + réponse) traités d'un coup ; 128K (gpt‑oss) à 1M (Kimi K3, DeepSeek V4) voire 10M (Llama 4 Scout). Coût mémoire = KV cache (§3.1). | Model cards **[vérifiées]** |
| **Température / top‑p** | Paramètres d'échantillonnage : température ↑ = sorties plus variées ; top‑p (nucleus) tronque la distribution aux tokens cumulant p de probabilité. Réglables dans Ollama (`Modelfile`), LM Studio, API OpenAI. | docs outils §1 |
| **Embeddings** | Vecteurs numériques représentant le sens d'un texte ; base de la recherche sémantique et du RAG. Modèles d'embedding ouverts : catégorie « embeddings » d'Ollama (docs.ollama.com **[vérifiée]**). | — |
| **RAG** | Retrieval‑Augmented Generation (Lewis et al., 2020) : récupérer des passages pertinents (vectoriels) puis les injecter dans le prompt. | https://arxiv.org/pdf/2005.11401 **[vérifiée]** |
| **Vector databases** | Voir §4.1 | — |
| **Fine‑tuning / LoRA / QLoRA** | LoRA (Hu et al., 2021) : n'entraîner que des matrices de rang faible ajoutées aux poids gelés ; QLoRA (Dettmers et al., 2023) : idem sur un modèle de base quantifié 4 bits → fine‑tuning d'un 7B sur 8–12 Go de VRAM. | LoRA : https://arxiv.org/abs/2106.09685v1 **[vérifiée]** ; QLoRA : arXiv 2305.14314 **[non re-vérifiée]** |
| **Outils de fine‑tuning** | **Unsloth** (« 2× plus rapide, 70 % de VRAM en moins, sans perte », 500+ modèles) https://unsloth.ai/docs **[vérifiée]**, https://github.com/unslothai/unsloth **[URL citée]** ; **Axolotl** https://docs.axolotl.ai/docs/unsloth.html **[vérifiée]** ; **HF PEFT + TRL** (SFTTrainer, DPOTrainer, GRPO) https://huggingface.co/docs/trl/main/en/peft_integration **[vérifiée]** | — |
| **Distillation** | Entraîner un petit modèle (« élève ») sur les sorties d'un grand (« professeur ») ; ex. DeepSeek‑R1‑Distill 1,5B→70B à partir de R1 671B. | https://huggingface.co/deepseek-ai/DeepSeek-R1 **[URL citée]** |
| **RLHF / DPO** | Alignement sur préférences humaines : RLHF (modèle de récompense + PPO) ; DPO (Direct Preference Optimization, 2023) l'approxime sans modèle de récompense ; implémentés dans TRL. | TRL docs **[vérifiée]** |
| **MoE** | Mixture of Experts : seuls k experts sur N sont activés par token → mémoire du total, vitesse/coût des actifs (ex. Mistral Small 4 : 119B total, 6B actifs, 128 experts/4 actifs ; Kimi K3 : 896 experts/16 actifs). | Mistral **[vérifiée]** ; NYU RITS **[vérifiée]** |
| **Speculative decoding** | Un petit modèle « draft » propose ~5 tokens, le grand les vérifie en une passe : gain typique 2–3× (1,9× mesuré) sans changer la sortie. NVIDIA annonce 2,6× sur Qwen‑235B NVFP4 (2 Spark). | https://www.dailydoseofds.com/p/speculative-decoding-in-llms/ **[vérifiée]** ; IntuitionLabs **[vérifiée]** |
| **KV cache** | Mémorisation des clés/valeurs d'attention des tokens déjà traités pour ne pas les recalculer ; grandit linéairement avec le contexte (formule §3.1). | https://boringbot.substack.com/p/kv-caching-and-speculative-decoding **[vérifiée]** |
| **GPU / TPU / NPU** | GPU (NVIDIA CUDA, AMD ROCm, Apple Metal) = calcul parallèle généraliste ; TPU = ASIC Google (supporté par vLLM) ; NPU = accélérateur embarqué (Apple Neural Engine, AMD XDNA, Qualcomm Hexagon, Ascend) — vLLM liste CUDA, ROCm, Intel GPU, TPU, Ascend NPU, Apple Silicon. | docs vLLM **[vérifiée]** |
| **FLOPS** | Opérations flottantes par seconde ; ex. DGX Spark ~1 PFLOPS FP4 sparse / ~500 TFLOPS dense. Le prefill est borné par les FLOPS, la génération par la bande passante (Go/s). | IntuitionLabs **[vérifiée]** ; llama.cpp #4167 **[vérifiée]** |

### 4.1 Bases vectorielles

| Base | Type | Licence | Déploiement | Source |
|---|---|---|---|---|
| **Qdrant** | Moteur dédié (Rust) | Apache 2.0 | OSS auto-hébergé, Cloud, Hybrid Cloud (BYOC) ; fusion dense+sparse, quantization scalaire/PQ/binaire | https://bigdataboutique.com/blog/vector-database-comparison-2026 **[vérifiée]** (25 oct. 2026) |
| **Weaviate** | Moteur dédié (Go) | BSD‑3‑Clause | OSS, Cloud, BYOC ; recherche hybride native | idem |
| **Pinecone** | Service managé | Propriétaire | Cloud uniquement (pods retirés aux nouveaux clients depuis août 2025) | idem |
| **pgvector** | Extension PostgreSQL | PostgreSQL License | Partout où il y a Postgres (Supabase, RDS, Scaleway…) ; idéal pour commencer | https://alexcloudstar.com/blog/vector-database-comparison-2026/ **[vérifiée]** |
| **Chroma** | Base embarquée Python/JS | Apache 2.0 | `pip install chromadb` ; prototypage, intégrée à Langflow | https://www.kdnuggets.com/best-no-code-llm-app-builders **[vérifiée]** ; dépôt https://github.com/chroma-core/chroma **[non re-vérifiée]** |
| **Milvus** | Moteur distribué (Zilliz) | Apache 2.0 | Kubernetes / Zilliz Cloud ; très grande échelle | https://www.groovyweb.co/blog/top-10-ai-vector-databases-2026 **[vérifiée]** ; dépôt https://github.com/milvus-io/milvus **[non re-vérifiée]** |

Recommandation pédagogique : pgvector (déjà dans Postgres) → Chroma (notebook) → Qdrant (production auto-hébergée).

---

## 5. Frameworks d'agents, protocoles, agents de code

### 5.1 Frameworks d'applications LLM et d'agents

| Framework | Éditeur | Langages | Licence | État nov. 2026 | URL |
|---|---|---|---|---|---|
| **LangChain / LangGraph** | LangChain Inc. | Python, JS | MIT | langchain v1.4.6 (14 oct. 2026), langchain‑core v1.7.0 (22 oct. 2026), **LangGraph v1.2.0** (12 mai 2026 : timeouts et gestion d'erreur par nœud, DeltaChannel) | https://docs.langchain.com/oss/python/releases/changelog.md **[vérifiée]** |
| **LlamaIndex** | LlamaIndex | Python, TS | MIT | Référence pour RAG / ingestion documentaire | https://docs.llamaindex.ai **[non re-vérifiée]** ; comparatif : https://itsourcecode.com/?p=153165 **[vérifiée]** |
| **Haystack** | deepset | Python | Apache 2.0 | Pipelines RAG orientés production | https://haystack.deepset.ai **[non re-vérifiée]** |
| **CrewAI** | CrewAI | Python | MIT | Agents « rôles » multi-agents | https://docs.crewai.com **[non re-vérifiée]** |
| **Microsoft Agent Framework** | Microsoft | .NET, Python | MIT | **v1.0 GA le 3 avril 2026** ; successeur de **Semantic Kernel** (bugs critiques corrigés ≥ 1 an) et d'**AutoGen** (maintenance depuis le 2 oct. 2025) | https://atlan.com/know/ai-agent/microsoft/agent-framework/ **[vérifiée]** ; https://github.com/microsoft/agent-framework **[URL citée]** ; Semantic Kernel : https://learn.microsoft.com/en-us/semantic-kernel/overview/ **[URL citée par ZenML]** |
| **AG2** (fork communautaire d'AutoGen) | Communauté | Python | Apache 2.0 | Continuation indépendante d'AutoGen 0.2 | https://github.com/ag2ai/ag2 **[non re-vérifiée]** |
| **Agno** (ex‑Phidata) | Agno | Python | MPL‑2.0 | Agents multimodaux légers | https://docs.agno.com **[non re-vérifiée]** |
| **Pydantic AI** | Pydantic | Python | MIT | Agents typés, validation de sorties | https://ai.pydantic.dev **[non re-vérifiée]** |
| **Vercel AI SDK** | Vercel | TypeScript | Apache 2.0 | Streaming UI React/Next.js, `generateText`, agents | https://ai-sdk.dev **[non re-vérifiée]** |
| **OpenAI Agents SDK** | OpenAI | Python, TS | MIT | Handoffs, agents vocaux temps réel, tracing OTel ; `pip install openai-agents` ; agnostique (100+ LLM) | https://composio.dev/blog/claude-agents-sdk-vs-openai-agents-sdk-vs-google-adk **[vérifiée]** ; docs https://openai.github.io/openai-agents-python/ **[non re-vérifiée]** |
| **Claude Agent SDK** | Anthropic | Python, TS | MIT | Accès shell/fichiers, sous-agents, serveurs MCP, modes de permission, `max_budget_usd`, déploiement Bedrock/Vertex/Azure ; `pip install claude-agent-sdk` | Composio **[vérifiée]** ; docs https://docs.claude.com/en/api/agent-sdk/overview **[non re-vérifiée]** |
| **Google ADK** | Google | Python, TS, Java, Go | Apache 2.0 | Workflows en graphe (ADK 2.0 alpha), A2A natif, Vertex AI, UI web | Composio **[vérifiée]** ; docs https://google.github.io/adk-docs/ **[non re-vérifiée]** |
| **smolagents** | Hugging Face | Python | Apache 2.0 | Agents « code-acting » minimalistes | https://huggingface.co/docs/smolagents **[non re-vérifiée]** |

### 5.2 Builders low-code

| Outil | Dépôt | Licence | Repères | Source |
|---|---|---|---|---|
| **Dify** | https://github.com/langgenius/dify | « Dify OSS License » (Apache 2.0 + conditions multi-tenant) | ~140k étoiles ; workflows, RAG, MCP, RBAC/SSO | https://futureagi.com/blog/dify-vs-flowise-vs-langflow-2026/ **[vérifiée]** ; https://www.kdnuggets.com/best-no-code-llm-app-builders **[vérifiée]** |
| **Flowise** | https://github.com/FlowiseAI/Flowise | Apache 2.0 | ~52,6k étoiles ; composants LangChain/LlamaIndex | idem |
| **Langflow** | https://github.com/langflow-ai/langflow | MIT | ~148k étoiles ; composants Python, export en serveur MCP ; service hébergé DataStax arrêté en avril 2026 | idem |

### 5.3 Protocoles : MCP et A2A

**MCP — Model Context Protocol** (Anthropic, nov. 2024 ; aujourd'hui projet Linux Foundation / Agentic AI Foundation)
- Primitives : *tools*, *resources*, *prompts* côté serveur ; *sampling*, *elicitation* côté client ; transports stdio et HTTP streamable.
- Versions de la spécification : 2024‑11‑05 → 2025‑03‑26 → 2025‑06‑18 → **2025‑11‑25 (stable)** → **2026‑07‑28 (stable, la plus récente)** — https://releases.sh/modelcontextprotocol/mcp-specification.md **[vérifiée]** ; spec officielle https://modelcontextprotocol.io/specification **[URL citée]** ; dépôts (SDK, serveurs de référence, registry) https://github.com/orgs/modelcontextprotocol/repositories **[vérifiée]** ; MCP Registry (sept. 2025) : https://www.dsebastien.net/model-context-protocol-registry/ **[vérifiée]**.
- Supporté par Claude (Desktop, Code, Agent SDK), Ollama, Open WebUI, Dify, Langflow, Cursor, Codex, Gemini CLI, Copilot (sources §1, §5.2, §5.4).

**A2A — Agent2Agent** (Google, avril 2025 → Linux Foundation)
- **v1.0** = première spec stable ; **150+ organisations** (vs 50 en avril 2025) ; SDK Python, JS, Java, Go, .NET ; 22 000+ étoiles — communiqué LF du 9 avril 2026 https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year **[vérifiée]** ; site https://a2a-protocol.org/ **[URL citée]** ; blog Google https://opensource.googleblog.com/2026/04/a-year-of-open-collaboration-celebrating-the-anniversary-of-a2a.html **[vérifiée]**.
- **v1.2** (Google Cloud Next, 22 avril 2026) : Agent Cards signées liées à un domaine via DID (DNS TXT / well-known) — https://www.cloudmagazin.com/en/2026/04/25/a2a-protocol-1-2-in-production-what-dach-cloud-architects-need-to-change-in-their-istio-setup-now/ **[vérifiée]**.
- Message clé : **MCP = agent ↔ outils/données ; A2A = agent ↔ agent (inter-organisations)** ; complémentaires (LF **[vérifiée]**).

### 5.4 Agents de code (état avril–août 2026)

| Agent | Éditeur | Forme | Open source | Prix (sources) | URL |
|---|---|---|---|---|---|
| **Claude Code** | Anthropic | CLI + VS Code/JetBrains + web/mobile/Slack | Non | Inclus Pro 20 $/mois ; Max 100–200 $/mois | https://claude.com/product/claude-code **[vérifiée via Tembo]** |
| **Codex CLI** | OpenAI | CLI + cloud + IDE + app | **Apache 2.0** | Go 8 $, Plus 20 $, Pro 100–200 $ | https://github.com/openai/codex **[URL citée]** ; https://developers.openai.com/codex/pricing **[URL citée]** |
| **Gemini CLI** | Google | CLI | **Apache 2.0** | Gratuit (accès individuel gratuit annoncé jusqu'au 18 juin 2026) | https://github.com/google-gemini/gemini-cli **[URL citée]** |
| **Cursor** | Anysphere | IDE (fork VS Code) | Non | Hobby gratuit, Pro 20 $, Pro+ 60 $, Ultra 200 $, Business 40 $/util. | https://www.cursor.com/ |
| **Windsurf** | Cognition (racheté ; intégré à Devin Desktop) | IDE | Non | Pro 20 $, Max 200 $, Teams 40 $/util. | https://windsurf.com/ |
| **Aider** | communauté (Paul Gauthier) | CLI intégrée à Git | **Apache 2.0** | Gratuit + clés API | https://aider.chat/ |
| **Cline** | Cline | Extension VS Code / JetBrains / CLI | **Apache 2.0** | Gratuit (BYOK) | https://cline.bot/ |
| **GitHub Copilot** | GitHub | IDE + agent cloud + revue de PR | Non (extension VS Code open source) | Free, Pro 10 $, Pro+ 39 $, Business 19 $, Enterprise 39 $ | https://github.com/features/copilot |
| **OpenCode** | communauté | TUI/CLI | MIT | Gratuit (BYOK), Go 10 $/mois | https://opencode.ai/ |
| **Devin** | Cognition | Agent cloud autonome | Non | Pro 20 $, Max 200 $, Teams 80 $/mois | https://devin.ai |
| **Google Antigravity** | Google | IDE agentique | Non | Gratuit particuliers | https://antigravity.google |
| **Continue** | Continue | Extension VS Code/JetBrains | Apache 2.0 | Team 20 $/siège | https://continue.dev |

Sources : Firecrawl (3 août 2026) https://www.firecrawl.dev/blog/best-ai-coding-agents **[vérifiée]** ; Tembo (21 avril 2026) https://www.tembo.io/blog/best-ai-for-coding **[vérifiée]**. Scores cités : Claude Opus 4.8 = 88,6 % SWE‑bench Verified ; Cursor Composer 2 = 61,7 % Terminal‑Bench 2.0 (Firecrawl). Rappel : les scores mesurent le **modèle**, pas l'agent.

### 5.5 « Vibe coding »
- Terme popularisé par Andrej Karpathy (février 2025) ; **mot de l'année 2025 du dictionnaire Collins** (annonce du 6 nov. 2025), défini comme « utiliser l'IA pour dire à une machine ce que l'on veut au lieu de le coder soi-même » — https://www.ctvnews.ca/lifestyle/article/vibe-coding-named-word-of-the-year-by-collins-dictionary/ **[vérifiée]**. À enseigner avec ses limites : revue de code, tests, sécurité (OWASP LLM10:2026 « Improper Output Handling » vise explicitement le code non sécurisé généré à grande échelle — §7).

### 5.6 « Agent Skills » (SKILL.md)
- Un *skill* = dossier contenant `SKILL.md` (en-tête YAML `name` + `description`, corps Markdown d'instructions) + scripts/modèles optionnels ; chargement progressif (seuls nom et description restent en contexte). Introduit par Anthropic pour Claude, publié comme **standard ouvert** sur https://agentskills.io **[URL citée]** ; dépôt de référence https://github.com/anthropics/skills **[URL citée]** ; lu par Claude Code, Codex CLI, Cursor, OpenCode, OpenClaw, Hermes Agent — https://parallel.ai/articles/what-are-agent-skills **[vérifiée]** (18 août 2026).

---

## 6. Évaluation et observabilité

### 6.1 Plateformes d'observabilité (Infrabase, mis à jour 25 oct. 2026 — https://infrabase.ai/blog/llm-observability-tools-compared **[vérifiée]**)

| Outil | Open source | Prix de base | Points clés | URL officielle |
|---|---|---|---|---|
| **LangSmith** | Non | n.p. | Tracing LangChain/LangGraph, datasets d'évaluation, déploiement (Fleet) | https://smith.langchain.com **[non re-vérifiée]** |
| **Langfuse** | Oui (MIT, cœur) | Hobby gratuit 50k unités/mois ; Core 29 $/mois ; Pro 199 $/mois | Tracing, prompts, évals, coûts, auto-hébergement ; **racheté par ClickHouse (janv. 2026)** | https://langfuse.com **[non re-vérifiée]** |
| **Braintrust** | Non | n.p. | Évals + expérimentations, Brainstore, agent « Loop » | https://www.braintrust.dev **[vérifiée via article DeepEval alternatives]** |
| **Arize Phoenix** | Source disponible (Elastic License 2.0) | AX gratuit 25k spans/mois ; Pro 50 $/mois | OpenTelemetry, local ; **Arize racheté par Dynatrace (oct. 2026)** | https://phoenix.arize.com **[non re-vérifiée]** |
| **Helicone** | Apache 2.0 | Gratuit 10k req./mois ; Pro 79 $ ; Team 799 $ | Proxy une ligne ; en maintenance chez Mintlify (mars 2026) | https://www.helicone.ai **[non re-vérifiée]** |
| **Opik** (Comet) | Apache 2.0 | n.p. | Métriques intégrées (hallucination, pertinence) | https://github.com/comet-ml/opik **[non re-vérifiée]** |
| **W&B Weave** | Apache 2.0 (Weave) | n.p. | Dans CoreWeave depuis mai 2025 | https://wandb.ai **[non re-vérifiée]** |
| **MLflow (GenAI)** | Apache 2.0 | Gratuit | `mlflow.genai.evaluate()`, tracing | https://mlflow.org **[vérifiée via search]** |

### 6.2 Frameworks d'évaluation (Future AGI **[vérifiée]** ; QA Skills, 29 juin 2026 **[vérifiée]** — https://qaskills.sh/blog/deepeval-vs-ragas-vs-promptfoo-2026)

| Outil | Dépôt | Licence | Usage |
|---|---|---|---|
| **promptfoo** | https://github.com/promptfoo/promptfoo | MIT | Tests de régression de prompts en YAML, comparaison de modèles, **red-teaming** ; **rachat par OpenAI annoncé le 9 mars 2026** |
| **DeepEval** | https://github.com/confident-ai/deepeval | Apache 2.0 | Tests unitaires style pytest (`assert_test`) ; métriques Answer Relevancy, Faithfulness, Hallucination, G‑Eval |
| **Ragas** | https://github.com/vibrantlabsai/ragas (ex explodinggradients) | Apache 2.0 | Métriques RAG : Faithfulness, Answer Relevancy, Context Precision/Recall, Noise Sensitivity (v0.4.3, janv. 2026) |
| **Inspect AI** | https://github.com/UKGovernmentBEIS/inspect_ai | MIT | Évaluation de capacités et d'agents (UK AISI), sandboxes |
| **OpenAI Evals** | https://github.com/openai/evals **[non re-vérifiée]** | MIT | Registre historique d'évals OpenAI ; comparatif https://qaskills.sh/compare/promptfoo-vs-openai-evals **[vérifiée]** |
| **lm-evaluation-harness** | https://github.com/EleutherAI/lm-evaluation-harness **[non re-vérifiée]** | MIT | Moteur derrière l'Open LLM Leaderboard (MMLU, GSM8K…) |

### 6.3 Benchmarks — définitions (Atlan, 27 juil. 2026 — https://atlan.com/know/llm-benchmarks-explained.md **[vérifiée]** ; sites officiels **[non re-vérifiés]** sauf mention)

| Benchmark | Mesure | Repères 2026 | URL |
|---|---|---|---|
| **MMLU / MMLU‑Pro** | QCM de connaissances (57 matières) ; Pro = version durcie | Saturé > 88 % (Atlan) ; gpt‑oss‑120b 90,0 ; Gemma 4 31B MMLU‑Pro 85,2 | https://github.com/hendrycks/test |
| **GPQA Diamond** | Questions scientifiques niveau doctorat, « Google-proof » | Kimi K3 93,5 ; DeepSeek V4.1 Flash 90,9 ; Qwen3.8‑27B 89,2 | https://github.com/idavidrein/gpqa |
| **SWE‑bench Verified / Pro** | Résolution de vrais issues GitHub (tests unitaires) ; Pro = jeu plus dur et privé | Verified : Beam 81,6 %, DeepSeek V4 Pro 80,6 % ; Pro : Qwen3.8‑Max 67,7 % | https://www.swebench.com |
| **HumanEval** | 164 problèmes Python (pass@1) | Saturé (Atlan) ; remplacé par **LiveCodeBench** (Qwen3.8‑27B v6 = 90,3) | https://github.com/openai/human-eval ; https://livecodebench.github.io |
| **Terminal‑Bench 2.x / 3.0** | Tâches d'agent dans un terminal | 2.1 : DeepSeek V4.1 Flash 90,6 ; 3.0 : DeepSeek 30,0 (Morph) | https://www.tbench.ai |
| **ARC‑AGI 1/2/3** | Raisonnement abstrait visuel (généralisation) | Prix ARC ; v3 interactif (2026) | https://arcprize.org |
| **Humanity's Last Exam (HLE)** | 2 500 questions d'experts, 100+ sujets (CAIS + Scale AI, janv. 2025) ; **HLE‑Diamond** l'a remplacé dans l'index AA v5 | Meilleur score ~46,9 % (mai 2026, Atlan) ; DeepSeek V4.1 Flash 36,8 / 63,9 avec outils | https://agi.safe.ai/ **[URL citée]** |
| **AIME 2025/2026** | Olympiade de maths US | Gemma 4 31B 89,2 % ; GLM‑5.2 99,2 | https://artofproblemsolving.com |
| **τ²‑bench / Tau‑Bench** | Agents conversationnels avec outils (retail, airline) | gpt‑oss‑120b retail 67,8 | https://github.com/sierra-research/tau2-bench |
| **GDPval‑AA, SciCode, AA‑LCR, FrontierCode 2.0, Terminal‑Bench‑Science** | Composants de l'Artificial Analysis Index v5 (27 oct. 2026) | 60 % de tests privés | ActuIA **[vérifiée]** |

---

## 7. Sécurité des applications LLM et agents

### 7.1 OWASP Top 10 for LLM Applications — **version 2026 (publiée le 4 août 2026)** vs 2025

Source : OWASP GenAI Security Project https://genai.owasp.org/ **[URL citée par Coralogix]** ; synthèse Modulos https://docs.modulos.ai/frameworks/owasp-top-10-llm/index **[vérifiée]** ; liste 2025 : https://coralogix.com/ai-blog/owasp-top-10-for-llm-applications/ **[vérifiée]** et https://tds.s-anand.net/2026-02/docs/week-7/05-owasp-llm-top-10/ **[vérifiée]**.

| Rang 2026 | Entrée 2026 | Rang 2025 | Définition courte |
|---|---|---|---|
| LLM01:2026 | **Prompt Injection** | LLM01 | Entrées (directes, indirectes, **multimodales : image/audio**) qui détournent le modèle |
| LLM02:2026 | **Sensitive Information Disclosure** | LLM02 | Fuite de données personnelles, secrets, données d'autres utilisateurs |
| LLM03:2026 | **Excessive Agency** | LLM06 (↑) | Permissions/outils/autonomie excessifs → actions dommageables |
| LLM04:2026 | **Supply Chain** | LLM03 | Modèles, datasets, plugins, paquets compromis ; artefact de modèle falsifié |
| LLM05:2026 | **Data and Model Poisoning** | LLM04 | Empoisonnement des données d'entraînement/fine‑tuning/embeddings (inclut subversion du fine‑tuning) |
| LLM06:2026 | **Unbounded Consumption** | LLM10 (↑) | DoS, explosion de coûts, extraction de modèle |
| LLM07:2026 | **Misinformation** | LLM09 | Hallucinations crédibles utilisées en aval |
| LLM08:2026 | **Hidden Context Exposure** (ex « System Prompt Leakage ») | LLM07 | Exposition du contexte caché : prompt système, schémas d'outils |
| LLM09:2026 | **Vector and Embedding Weaknesses** | LLM08 | Fuites/empoisonnement des stores RAG multi-tenant |
| LLM10:2026 | **Improper Output Handling** | LLM05 | Sorties non validées → XSS, SQLi, RCE ; **code non sécurisé généré à grande échelle** |

Liste 2025 (archivée) pour mémoire : LLM01 Prompt Injection ; LLM02 Sensitive Information Disclosure ; LLM03 Supply Chain ; LLM04 Data and Model Poisoning ; LLM05 Improper Output Handling ; LLM06 Excessive Agency ; LLM07 System Prompt Leakage ; LLM08 Vector and Embedding Weaknesses ; LLM09 Misinformation ; LLM10 Unbounded Consumption (Coralogix **[vérifiée]**).

### 7.2 OWASP Agentic
- **OWASP Top 10 for Agentic Applications** (ASI01–ASI10) : à associer à la liste LLM dès que le modèle « agit » (appelle des outils, garde une mémoire, déclenche des effets) ; OWASP : « pair it with the Agentic list, because neither one covers that ground alone » — https://docs.modulos.ai/frameworks/owasp-top-10-agentic/ **[URL citée par Modulos]** ; hub https://docs.modulos.ai/frameworks/owasp/ **[URL citée]**. La liste exacte ASI01–ASI10 n'a pas pu être relue dans cette session : **à extraire de genai.owasp.org avant le cours**.
- **Agentic AI – Threats and Mitigations** (OWASP, fév. 2025) : taxonomie des menaces agentiques (memory poisoning, tool misuse, privilege compromise, cascading hallucinations, rogue agents…) — https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/ **[non re-vérifiée]**.

### 7.3 Attaques à expliquer
- **Prompt injection directe** : l'utilisateur écrit l'instruction malveillante. **Indirecte** : l'instruction est cachée dans un contenu lu par l'agent (page web, PDF, e‑mail, image) — exemple TDS : page scrapée qui donne des ordres à l'agent ; il n'existe pas de correctif complet, il faut **limiter les capacités** (TDS **[vérifiée]**).
- **Jailbreak** : contourner les règles d'alignement (role-play, encodages, many-shot). Lien avec LLM01.
- **Data / model poisoning** : LLM05:2026 ; inclut les backdoors via fine‑tuning et l'empoisonnement de bases RAG (LLM09:2026).
- **Supply chain** : modèles HF falsifiés, pickles malveillants (préférer `safetensors`), serveurs MCP tiers non audités (LLM04:2026).

### 7.4 Référentiels et guardrails

| Ressource | Rôle | URL |
|---|---|---|
| **NIST AI RMF 1.0** (janv. 2023) + **Generative AI Profile (NIST AI 600‑1, juil. 2024)** | Cadre de gestion des risques IA (Govern, Map, Measure, Manage) | https://www.nist.gov/itl/ai-risk-management-framework **[non re-vérifiée]** |
| **MITRE ATLAS** | Matrice tactiques/techniques d'attaque contre les systèmes IA (équivalent ATT&CK) | https://atlas.mitre.org **[non re-vérifiée]** |
| **Llama Guard** (Meta) | Classifieur d'entrées/sorties (catégories de danger), versions 3/4, dispo sur Ollama | https://ollama.com/search (catégorie safety) **[vérifiée]** ; https://huggingface.co/meta-llama **[non re-vérifiée]** |
| **NeMo Guardrails** (NVIDIA) | Rails programmables (Colang) : topic, jailbreak, fact-check | https://github.com/NVIDIA/NeMo-Guardrails **[non re-vérifiée]** |
| **Guardrails AI** | Validateurs de sorties (PII, toxicité, JSON) | https://github.com/guardrails-ai/guardrails **[non re-vérifiée]** |
| **promptfoo red-team** | Tests automatisés d'injection/jailbreak | https://github.com/promptfoo/promptfoo **[URL citée]** |
| **Mistral Moderation 2603** | Modèle de modération (mars 2026) | Serenities AI **[vérifiée]** |

### 7.5 Gestion des clés API et FinOps LLM (bonnes pratiques à enseigner)
- Jamais de clé dans le code ou le dépôt : variables d'environnement, gestionnaires de secrets, rotation ; clés par environnement et par projet ; quotas et alertes de dépense (LLM06:2026 Unbounded Consumption).
- Plafonner le budget dans les agents : ex. `max_budget_usd` du Claude Agent SDK (Composio **[vérifiée]**).
- Suivre coûts/latence par trace : Langfuse, Helicone, LangSmith (§6.1).
- Arbitrage local vs cloud : §3.7 (RTX 4090 à 0,34 $/h ; H100 Scaleway 2,73 €/h) vs achat (DGX Spark 4 699–6 950 $, Strix Halo 3 449 $+, RTX 5090 ~1 999 $).
- Leviers de coût : quantization, MoE à faibles actifs, cache de prompts, speculative decoding, batching (vLLM).

---

## 8. Génération d'images, vidéo, audio, voix — état 2026

> Avertissement : le quota de recherche partagé s'est épuisé avant cette section. Les éléments ci-dessous proviennent des pages déjà lues (**[vérifiée]**) ou de connaissances générales avec URL officielles stables **[non re-vérifiées]** — à contrôler avant intégration aux supports.

| Domaine | Outil | Statut | URL |
|---|---|---|---|
| Image (ouvert, local) | **FLUX.1 Schnell** (Black Forest Labs) — Apache 2.0 | Génération rapide ; FLUX‑dev‑4bit 12B tourne sur Mac M5 (3,8× plus vite que M4, Apple **[vérifiée]**) | https://huggingface.co/black-forest-labs/FLUX.1-schnell **[URL citée par HF blog]** |
| Image (ouvert, local) | **Stable Diffusion 3.5 Large / Large Turbo** (Stability AI) — Stability Community License | Typographie, personnalisation | https://huggingface.co/stabilityai/stable-diffusion-3.5-large **[URL citée]** |
| Image (ouvert, local) | **ComfyUI** (interface nodale) ; KoboldCpp intègre SD1.5/SDXL/SD3/Flux et un endpoint compatible ComfyUI/A1111 | Standard de fait pour SD/Flux en local | https://github.com/comfyanonymous/ComfyUI **[non re-vérifiée]** ; KoboldCpp wiki **[vérifiée]** |
| Image (API) | **gpt‑image** (OpenAI, successeur de DALL·E 3) ; **Midjourney** (v7, web + Discord) | Fermés | https://platform.openai.com/docs/guides/image-generation ; https://www.midjourney.com **[non re-vérifiées]** |
| Vidéo | **Sora** (OpenAI), **Veo 3** (Google DeepMind), **Runway Gen‑4**, **Kling** (Kuaishou) | Fermés, API/apps | https://openai.com/sora ; https://deepmind.google/models/veo/ ; https://runwayml.com ; https://klingai.com **[non re-vérifiées]** |
| Voix (TTS) | **ElevenLabs** (fermé) ; **Voxtral TTS 4B** (Mistral, 26 mars 2026, CC BY‑NC 4.0) ; Kokoro, Qwen3‑TTS, OuteTTS (intégrés à KoboldCpp) | Ouvert/fermé | https://elevenlabs.io **[non re-vérifiée]** ; https://huggingface.co/mistralai/Voxtral-4B-TTS-2603 **[URL citée]** ; KoboldCpp wiki **[vérifiée]** |
| Reconnaissance vocale | **Whisper** (OpenAI, MIT) — intégré à KoboldCpp (`/v1/audio/transcriptions`), LocalAI | Ouvert | https://github.com/openai/whisper **[non re-vérifiée]** ; KoboldCpp wiki **[vérifiée]** |
| Musique | **Suno** (fermé) ; **ACE‑Step 1.5** (ouvert, intégré à KoboldCpp) | — | https://suno.com **[non re-vérifiée]** ; KoboldCpp wiki **[vérifiée]** |
| Multimodal « tout-en-un » local | **LocalAI** (LLM + images + audio + embeddings, API OpenAI) | MIT | https://localai.io **[vérifiée]** |

---

## 9. Propositions de séquences pédagogiques (découpage indicatif, à intégrer au plan 150 h)

| Séquence | Durée | Contenu | Pratique |
|---|---|---|---|
| A. Premier LLM local | 3 h | §1 : Ollama + LM Studio ; tokens, contexte, température | `ollama run gemma4:26b`, comparer 3 modèles sur un texte français |
| B. Choisir un modèle | 3 h | §2 : tailles, MoE, licences, classements | Lire une model card HF, vérifier la licence, calculer la mémoire |
| C. Dimensionner le matériel | 3 h | §3 : quantization, formule, bande passante | Exercice : « quel modèle pour mon Mac 16 Go / ma RTX 3060 / 100 €/mois de cloud ? » |
| D. RAG local | 6 h | §4 : embeddings, pgvector/Chroma/Qdrant, Open WebUI | Pipeline RAG sur documents internes avec Ollama + Chroma |
| E. Fine‑tuning | 6 h | §4 : LoRA/QLoRA, Unsloth, TRL | QLoRA d'un 3–8B sur RunPod 4090 (0,34 $/h) |
| F. Agents & MCP | 9 h | §5 : LangGraph / Agent SDK / MCP / A2A ; agents de code ; Skills | Écrire un serveur MCP, l'utiliser dans Claude Code / Open WebUI |
| G. Évaluer | 3 h | §6 : promptfoo, DeepEval, Ragas, Langfuse | Suite de tests promptfoo + tracing Langfuse |
| H. Sécuriser | 6 h | §7 : OWASP 2026 + Agentic, injection, guardrails, clés, FinOps | Red-team promptfoo, Llama Guard, budget d'agent |
| I. Médias génératifs | 3 h | §8 : Flux/ComfyUI local, Whisper, TTS | Génération d'image locale + transcription Whisper |

---

## 10. Index des URL (statut de vérification)

**Ouvertes ou issues d'un résultat de recherche pendant la session (vérifiées)** — 87 :
docs.ollama.com · ollama.com/download · ollama.com/search · kx.cloudingenium.com/en/ollama-local-llm-run-large-language-models-machine-guide/ · lmstudio.ai/docs · thundercompute.com/blog/lm-studio-local-llm · github.com/ggml-org/llama.cpp/discussions/4167 · docs.vllm.ai/en/latest/getting_started/quickstart/ · github.com/oobabooga/text-generation-webui · jan.ai · github.com/janhq/jan · alternativeto.net (GPT4All 3.0) · machinelearning.apple.com/research/exploring-llms-mlx-m5 · docs.openwebui.com/getting-started/quick-start/ · thomas-krenn.com (Open WebUI) · localai.io · promptquorum.com/power-local-llm/localai-explained · github.com/LostRuins/koboldcpp/wiki · github.com/exo-explore/exo · pinggy.io/blog/top_5_local_llm_tools_and_models/ · unsloth.ai/docs · docs.axolotl.ai/docs/unsloth.html · huggingface.co/docs/trl/main/en/peft_integration · huggingface.co/blog/daya-shankar/open-source-llm-models-to-run-locally · huggingface.co/blog/daya-shankar/open-source-llms · morphllm.com/best-open-source-llm · morphllm.com/gpt-oss · huggingface.co/Qwen/Qwen3.8-27B · datanorth.ai (Gemma 4) · ai.google.dev/edge/litert-lm/models/gemma-4 · mistral.ai/news/mistral-small-4/ · mistral.ai/news/devstral-2-vibe-cli/ · serenitiesai.com (Mistral 2026) · actuia.com (Mistral Large 4 / AA v5) · thenewstack.io/meta-muse-spark-open/ · en.wikipedia.org/wiki/Llama_(language_model) · en.wikipedia.org/wiki/Phi_(language_model) · rits.shanghai.nyu.edu (Kimi K3) · pureai.com (Kimi K3) · letsdatascience.com (Kimi K3.1 Pro) · llmreference.com (DeepSeek V4.1 Flash) · llmreference.com (GLM‑5.3‑Flash) · artificialanalysis.ai (GLM‑5.2) · artificialanalysis.ai (recent open weights) · datanorth.ai (Granite 4.2) · kdnuggets.com (SmolLM3) · swfte.com/lmarena · news.ainauten.com (Open LLM Leaderboard v3) · flaviocopes.com/llm-vram-requirements/ · inventivehq.com/tools/llm-vram-calculator · intuitionlabs.ai (DGX Spark) · servethehome.com (DGX Spark) · spheron.network (DGX Spark vs 5090) · presenc.ai (tokens/s 2026) · presenc.ai (RTX 5090) · presenc.ai (Strix Halo) · singhajit.com (RTX 3060) · formulamod.net (GPU 2026) · corelab.tech/llmgpu/ · computingforgeeks.com/best-gpu-for-llm/ · bestllmfor.com/benchmarks/ · kaitchup.substack.com (DGX Spark fine-tuning) · amd.com (Ryzen AI Max+ 395) · cloudzero.com (GPU pricing) · spheron.network (RunPod vs Vast) · scaleway.com/en/pricing/gpu · spheron.network (OVHcloud) · ovhcloud.com/en/public-cloud/prices · arxiv.org/abs/2106.09685v1 · arxiv.org/pdf/2005.11401 · dailydoseofds.com (speculative decoding) · boringbot.substack.com (KV cache) · bigdataboutique.com (vector DB 2026) · alexcloudstar.com (vector DB 2026) · groovyweb.co (vector DB) · docs.langchain.com changelog · itsourcecode.com (LangChain vs LlamaIndex) · atlan.com (Microsoft Agent Framework) · zenml.io (SK vs AutoGen) · composio.dev (SDK agents) · futureagi.com (Dify/Flowise/Langflow) · kdnuggets.com (no-code builders) · releases.sh (MCP spec) · github.com/orgs/modelcontextprotocol/repositories · dsebastien.net (MCP Registry) · linuxfoundation.org (A2A) · opensource.googleblog.com (A2A) · cloudmagazin.com (A2A 1.2) · firecrawl.dev (coding agents) · tembo.io (coding agents) · parallel.ai (Agent Skills) · ctvnews.ca (vibe coding) · infrabase.ai (observabilité) · qaskills.sh (DeepEval/Ragas/promptfoo) · qaskills.sh (promptfoo vs OpenAI Evals) · futureagi.com (eval frameworks) · braintrust.dev (DeepEval alternatives) · atlan.com (benchmarks) · coralogix.com (OWASP 2025) · docs.modulos.ai (OWASP LLM) · tds.s-anand.net (OWASP) · mlflow.org.

**Citées par une source vérifiée mais non ouvertes directement** : huggingface.co/Qwen/Qwen3.8-Flash-Next · huggingface.co/Qwen/Qwen3.8-2.4T-A95B · huggingface.co/Qwen/Qwen3-235B-A22B · qwen.ai/blog?id=qwen3.8 · deepmind.google/models/gemma/gemma-4/ · huggingface.co/google/gemma-4-26B-A4B-it · huggingface.co/collections/mistralai/mistral-small-4 · mistral.ai/en/news/mistral-small-3-1 · mistral.ai/en/news/devstral · huggingface.co/mistralai/Voxtral-4B-TTS-2603 · huggingface.co/meta-models/Muse-Spark-Open-816B-A42B · huggingface.co/meta-llama/Llama-4-Scout-17B-16E · huggingface.co/moonshotai/Kimi-K3 · huggingface.co/moonshotai/Kimi-K2.7-Code · huggingface.co/moonshotai/Kimi-K2.6 · huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash · huggingface.co/deepseek-ai/DeepSeek-V4-Pro · huggingface.co/deepseek-ai/DeepSeek-R1 · huggingface.co/zai-org/GLM-5.3-Flash · huggingface.co/nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16 · huggingface.co/microsoft/Phi-4-reasoning · huggingface.co/microsoft/Phi-4-mini-instruct · research.ibm.com/blog/introducing-granite-4-2 · huggingface.co/blog/reflection-beam · huggingface.co/black-forest-labs/FLUX.1-schnell · huggingface.co/stabilityai/stable-diffusion-3.5-large · artificialanalysis.ai/leaderboards/models · huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard_v3 · github.com/unslothai/unsloth · github.com/microsoft/agent-framework · learn.microsoft.com/en-us/semantic-kernel/overview/ · github.com/langgenius/dify · github.com/FlowiseAI/Flowise · github.com/langflow-ai/langflow · modelcontextprotocol.io/specification · a2a-protocol.org · github.com/openai/codex · github.com/google-gemini/gemini-cli · developers.openai.com/codex/pricing · claude.com/product/claude-code · cursor.com · windsurf.com · aider.chat · cline.bot · opencode.ai · agentskills.io · github.com/anthropics/skills · github.com/promptfoo/promptfoo · github.com/confident-ai/deepeval · github.com/vibrantlabsai/ragas · github.com/UKGovernmentBEIS/inspect_ai · agi.safe.ai · genai.owasp.org · docs.modulos.ai/frameworks/owasp-top-10-agentic/.

**Non re-vérifiées (adresses officielles connues, à contrôler)** : github.com/ggml-org/llama.cpp · github.com/nomic-ai/gpt4all · github.com/ml-explore/mlx-lm · github.com/chroma-core/chroma · github.com/milvus-io/milvus · docs.llamaindex.ai · haystack.deepset.ai · docs.crewai.com · github.com/ag2ai/ag2 · docs.agno.com · ai.pydantic.dev · ai-sdk.dev · openai.github.io/openai-agents-python/ · docs.claude.com/en/api/agent-sdk/overview · google.github.io/adk-docs/ · huggingface.co/docs/smolagents · lmarena.ai · smith.langchain.com · langfuse.com · phoenix.arize.com · helicone.ai · github.com/comet-ml/opik · wandb.ai · github.com/openai/evals · github.com/EleutherAI/lm-evaluation-harness · swebench.com · arcprize.org · tbench.ai · livecodebench.github.io · nist.gov/itl/ai-risk-management-framework · atlas.mitre.org · github.com/NVIDIA/NeMo-Guardrails · github.com/guardrails-ai/guardrails · genai.owasp.org/resource/agentic-ai-threats-and-mitigations/ · github.com/comfyanonymous/ComfyUI · openai.com/sora · deepmind.google/models/veo/ · runwayml.com · klingai.com · midjourney.com · elevenlabs.io · github.com/openai/whisper · suno.com · arXiv 2305.14314 (QLoRA).
