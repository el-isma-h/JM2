<?php
/**
 * Template : liste des formations. Variables : $data (réponse de l'API), $famille, $public_base.
 * Surcharge possible : {thème}/next-formation-catalogue/catalogue.php
 *
 * @package next-formation-catalogue
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$nfc_formations = isset( $data['formations'] ) && is_array( $data['formations'] ) ? $data['formations'] : array();
$nfc_org        = isset( $data['organisme'] ) && is_array( $data['organisme'] ) ? $data['organisme'] : array();
$nfc_modalites  = array(
	'presentiel' => 'Présentiel',
	'distanciel' => 'Distanciel',
	'mixte'      => 'Mixte',
	'afest'      => 'AFEST',
	'elearning'  => 'E-learning',
);
?>
<div class="nfc-catalogue">
	<?php if ( empty( $nfc_formations ) ) : ?>
		<p class="nfc-empty"><?php echo esc_html( '' !== $famille ? 'Aucune formation publiée dans cette famille pour le moment.' : 'Aucune formation publiée pour le moment.' ); ?></p>
	<?php else : ?>
		<ul class="nfc-list">
			<?php foreach ( $nfc_formations as $nfc_f ) : ?>
				<?php
				$nfc_prog     = isset( $nfc_f['programme'] ) && is_array( $nfc_f['programme'] ) ? $nfc_f['programme'] : null;
				$nfc_sessions = isset( $nfc_f['sessions'] ) && is_array( $nfc_f['sessions'] ) ? $nfc_f['sessions'] : array();
				$nfc_cert     = isset( $nfc_f['certification'] ) && is_array( $nfc_f['certification'] ) ? $nfc_f['certification'] : null;
				$nfc_slug     = isset( $nfc_f['slug'] ) ? (string) $nfc_f['slug'] : '';
				$nfc_id       = isset( $nfc_f['id'] ) ? (string) $nfc_f['id'] : '';
				?>
				<li class="nfc-item">
					<p class="nfc-meta">
						<?php
						$nfc_meta = array();
						if ( ! empty( $nfc_f['categorie'] ) ) {
							$nfc_meta[] = (string) $nfc_f['categorie'];
						}
						if ( $nfc_cert && ! empty( $nfc_cert['rncp'] ) ) {
							$nfc_meta[] = 'RNCP ' . (string) $nfc_cert['rncp'];
						} elseif ( $nfc_cert && ! empty( $nfc_cert['rs'] ) ) {
							$nfc_meta[] = 'RS ' . (string) $nfc_cert['rs'];
						}
						if ( ! empty( $nfc_f['eligibleCpf'] ) ) {
							$nfc_meta[] = 'Éligible CPF';
						}
						echo esc_html( implode( ' · ', $nfc_meta ) );
						?>
					</p>
					<h3 class="nfc-title"><?php echo esc_html( isset( $nfc_f['titre'] ) ? (string) $nfc_f['titre'] : '' ); ?></h3>
					<?php if ( $nfc_prog ) : ?>
						<dl class="nfc-facts">
							<div><dt><?php echo esc_html( 'Durée' ); ?></dt><dd><?php echo esc_html( (string) $nfc_prog['dureeHeures'] . ' h' ); ?></dd></div>
							<div><dt><?php echo esc_html( 'Modalité' ); ?></dt><dd><?php echo esc_html( isset( $nfc_modalites[ $nfc_prog['modalite'] ] ) ? $nfc_modalites[ $nfc_prog['modalite'] ] : (string) $nfc_prog['modalite'] ); ?></dd></div>
							<div><dt><?php echo esc_html( 'Tarif HT' ); ?></dt><dd><?php echo esc_html( null !== $nfc_prog['tarifHtCents'] ? nfc_format_cents( $nfc_prog['tarifHtCents'] ) : 'Sur devis' ); ?></dd></div>
						</dl>
						<?php if ( ! empty( $nfc_prog['objectifs'] ) ) : ?>
							<p class="nfc-objectives"><?php echo esc_html( wp_trim_words( (string) $nfc_prog['objectifs'], 40 ) ); ?></p>
						<?php endif; ?>
					<?php endif; ?>
					<p class="nfc-next">
						<?php
						if ( ! empty( $nfc_sessions ) ) {
							echo esc_html( 'Prochaine session : ' . nfc_format_date( $nfc_sessions[0]['debut'] ) );
						} else {
							echo esc_html( 'Dates à la demande' );
						}
						?>
					</p>
					<p class="nfc-links">
						<a href="<?php echo esc_url( $public_base . '#' . rawurlencode( $nfc_slug ) ); ?>" target="_blank" rel="noopener"><?php echo esc_html( 'Voir le programme' ); ?></a>
						<a href="<?php echo esc_url( add_query_arg( 'formation', rawurlencode( $nfc_id ), $public_base ) . '#demande' ); ?>" target="_blank" rel="noopener"><?php echo esc_html( 'Demander des informations' ); ?></a>
					</p>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
	<?php if ( ! empty( $nfc_org['nom'] ) ) : ?>
		<p class="nfc-footer"><?php echo esc_html( (string) $nfc_org['nom'] . ( ! empty( $nfc_org['nda'] ) ? ' · Déclaration d\'activité n° ' . (string) $nfc_org['nda'] : '' ) ); ?></p>
	<?php endif; ?>
</div>
