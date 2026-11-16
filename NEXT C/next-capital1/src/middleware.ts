import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, LOCALE_DEFAUT, estLocale } from "@/i18n/config";

function localePreferee(req: NextRequest): string {
  const cookie = req.cookies.get("next_locale")?.value;
  if (cookie && estLocale(cookie)) return cookie;
  const accept = req.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (estLocale(code)) return code;
  }
  return LOCALE_DEFAUT;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const premier = pathname.split("/")[1];
  if (estLocale(premier)) {
    const res = NextResponse.next();
    res.cookies.set("next_locale", premier, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }
  const locale = localePreferee(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|.*\\..*).*)"],
};

export { LOCALES };
