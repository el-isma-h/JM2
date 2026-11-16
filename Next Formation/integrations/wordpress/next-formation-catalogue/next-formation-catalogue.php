<?php
/**
 * Plugin Name:       Next Formation : catalogue
 * Description:       Affiche le catalogue public des formations d'un organisme Next Formation (shortcode [next_formation_catalogue]).
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Next Formation
 * License:           GPL-2.0-or-later
 * Text Domain:       next-formation-catalogue
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NFC_VERSION', '1.0.0' );
define( 'NFC_OPTION', 'nfc_settings' );
define( 'NFC_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Réglages : URL de l'instance, identifiant d'organisme (slug ou UUID), durée de cache.
 *
 * @return array{instance_url:string,org:string,cache_minutes:int}
 */
function nfc_settings() {
	$defaults = array(
		'instance_url'  => '',
		'org'           => '',
		'cache_minutes' => 30,
	);
	$saved    = get_option( NFC_OPTION, array() );
	return wp_parse_args( is_array( $saved ) ? $saved : array(), $defaults );
}

/* ---------------------------------------------------------------------------
 * Page de réglages (Réglages > Next Formation)
 * ------------------------------------------------------------------------- */

add_action( 'admin_menu', 'nfc_admin_menu' );
function nfc_admin_menu() {
	add_options_page( 'Next Formation', 'Next Formation', 'manage_options', 'next-formation-catalogue', 'nfc_render_settings_page' );
}

add_action( 'admin_init', 'nfc_register_settings' );
function nfc_register_settings() {
	register_setting(
		'nfc_settings_group',
		NFC_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'nfc_sanitize_settings',
			'default'           => array(),
		)
	);
}

function nfc_sanitize_settings( $input ) {
	$input = is_array( $input ) ? $input : array();
	$url   = isset( $input['instance_url'] ) ? esc_url_raw( trim( (string) $input['instance_url'] ), array( 'https', 'http' ) ) : '';
	$org   = isset( $input['org'] ) ? strtolower( sanitize_text_field( (string) $input['org'] ) ) : '';
	if ( '' !== $org && ! preg_match( '/^([a-z0-9-]{1,64}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/', $org ) ) {
		add_settings_error( NFC_OPTION, 'nfc_org', "Identifiant d'organisme invalide : slug (lettres, chiffres, tirets) ou UUID." );
		$org = '';
	}
	$minutes = isset( $input['cache_minutes'] ) ? absint( $input['cache_minutes'] ) : 30;
	$minutes = max( 5, min( 1440, $minutes ) );
	nfc_flush_cache();
	return array(
		'instance_url'  => untrailingslashit( $url ),
		'org'           => $org,
		'cache_minutes' => $minutes,
	);
}

function nfc_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$s = nfc_settings();
	if ( isset( $_POST['nfc_flush'] ) && check_admin_referer( 'nfc_flush' ) ) {
		nfc_flush_cache();
		echo '<div class="notice notice-success"><p>' . esc_html( 'Cache du catalogue vidé.' ) . '</p></div>';
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( 'Next Formation : catalogue' ); ?></h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'nfc_settings_group' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="nfc-url"><?php echo esc_html( "URL de l'instance" ); ?></label></th>
					<td>
						<input type="url" id="nfc-url" class="regular-text" name="<?php echo esc_attr( NFC_OPTION ); ?>[instance_url]" value="<?php echo esc_attr( $s['instance_url'] ); ?>" placeholder="https://app.votre-instance.fr" />
						<p class="description"><?php echo esc_html( 'Adresse de votre espace Next Formation, sans chemin.' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="nfc-org"><?php echo esc_html( "Identifiant d'organisme" ); ?></label></th>
					<td>
						<input type="text" id="nfc-org" class="regular-text" name="<?php echo esc_attr( NFC_OPTION ); ?>[org]" value="<?php echo esc_attr( $s['org'] ); ?>" />
						<p class="description"><?php echo esc_html( "Slug du catalogue public (fin de l'adresse /catalogue-public/…) ou identifiant de l'organisme." ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="nfc-cache"><?php echo esc_html( 'Durée du cache (minutes)' ); ?></label></th>
					<td>
						<input type="number" id="nfc-cache" min="5" max="1440" name="<?php echo esc_attr( NFC_OPTION ); ?>[cache_minutes]" value="<?php echo esc_attr( (string) $s['cache_minutes'] ); ?>" />
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
		<form method="post">
			<?php wp_nonce_field( 'nfc_flush' ); ?>
			<input type="hidden" name="nfc_flush" value="1" />
			<?php submit_button( 'Vider le cache', 'secondary', 'submit', false ); ?>
		</form>
		<h2><?php echo esc_html( 'Utilisation' ); ?></h2>
		<p><code>[next_formation_catalogue]</code> <?php echo esc_html( ': tout le catalogue.' ); ?></p>
		<p><code>[next_formation_catalogue famille="Bureautique"]</code> <?php echo esc_html( ': une famille (catégorie de formation).' ); ?></p>
		<p><code>[next_formation_catalogue mode="iframe" hauteur="900"]</code> <?php echo esc_html( ": widget en iframe (hauteur ajustée automatiquement)." ); ?></p>
	</div>
	<?php
}

/* ---------------------------------------------------------------------------
 * Récupération du catalogue (API publique JSON, cache par transient)
 * ------------------------------------------------------------------------- */

function nfc_transient_key( $org, $famille ) {
	return 'nfc_' . md5( $org . '|' . $famille );
}

function nfc_flush_cache() {
	$keys = get_option( 'nfc_cache_keys', array() );
	if ( is_array( $keys ) ) {
		foreach ( $keys as $k ) {
			delete_transient( $k );
			delete_transient( $k . '_stale' );
		}
	}
	update_option( 'nfc_cache_keys', array(), false );
}

/**
 * @return array|WP_Error
 */
function nfc_fetch_catalogue( $famille = '' ) {
	$s = nfc_settings();
	if ( '' === $s['instance_url'] || '' === $s['org'] ) {
		return new WP_Error( 'nfc_config', "Catalogue non configuré : renseignez l'URL de l'instance et l'identifiant d'organisme dans Réglages, Next Formation." );
	}
	$key    = nfc_transient_key( $s['org'], $famille );
	$cached = get_transient( $key );
	if ( is_array( $cached ) ) {
		return $cached;
	}
	$url = $s['instance_url'] . '/api/public/' . rawurlencode( $s['org'] ) . '/catalogue';
	if ( '' !== $famille ) {
		$url = add_query_arg( 'famille', rawurlencode( $famille ), $url );
	}
	$res = wp_remote_get(
		$url,
		array(
			'timeout' => 8,
			'headers' => array( 'Accept' => 'application/json' ),
		)
	);
	$stale = get_transient( $key . '_stale' );
	if ( is_wp_error( $res ) || 200 !== (int) wp_remote_retrieve_response_code( $res ) ) {
		// Instance indisponible : la dernière copie connue est servie plutôt qu'une erreur sur le site.
		if ( is_array( $stale ) ) {
			return $stale;
		}
		$code = is_wp_error( $res ) ? $res->get_error_message() : (string) wp_remote_retrieve_response_code( $res );
		return new WP_Error( 'nfc_http', 'Catalogue momentanément indisponible (' . $code . ').' );
	}
	$data = json_decode( wp_remote_retrieve_body( $res ), true );
	if ( ! is_array( $data ) || ! isset( $data['formations'] ) || ! is_array( $data['formations'] ) ) {
		return is_array( $stale ) ? $stale : new WP_Error( 'nfc_json', 'Réponse du catalogue illisible.' );
	}
	set_transient( $key, $data, (int) $s['cache_minutes'] * MINUTE_IN_SECONDS );
	set_transient( $key . '_stale', $data, 7 * DAY_IN_SECONDS );
	$keys = get_option( 'nfc_cache_keys', array() );
	$keys = is_array( $keys ) ? $keys : array();
	if ( ! in_array( $key, $keys, true ) ) {
		$keys[] = $key;
		update_option( 'nfc_cache_keys', array_slice( $keys, -200 ), false );
	}
	return $data;
}

/* ---------------------------------------------------------------------------
 * Affichage
 * ------------------------------------------------------------------------- */

/** Origine (schéma://hôte[:port]) de l'instance, pour filtrer les messages de l'iframe. */
function nfc_origin( $url ) {
	$p = wp_parse_url( $url );
	if ( empty( $p['scheme'] ) || empty( $p['host'] ) ) {
		return '';
	}
	return $p['scheme'] . '://' . $p['host'] . ( isset( $p['port'] ) ? ':' . $p['port'] : '' );
}

function nfc_format_cents( $cents ) {
	if ( null === $cents || '' === $cents ) {
		return '';
	}
	return number_format_i18n( ( (int) $cents ) / 100, 2 ) . ' €';
}

function nfc_format_date( $iso ) {
	$t = strtotime( (string) $iso );
	return $t ? date_i18n( 'j F Y', $t ) : '';
}

/**
 * Charge un template ; un thème peut le surcharger dans {thème}/next-formation-catalogue/{nom}.php.
 */
function nfc_template( $name, $vars ) {
	$theme = locate_template( 'next-formation-catalogue/' . $name . '.php' );
	$file  = $theme ? $theme : NFC_DIR . 'templates/' . $name . '.php';
	if ( ! file_exists( $file ) ) {
		return '';
	}
	ob_start();
	extract( $vars, EXTR_SKIP ); // phpcs:ignore WordPress.PHP.DontExtract.extract_extract
	include $file;
	return (string) ob_get_clean();
}

add_shortcode( 'next_formation_catalogue', 'nfc_shortcode' );
function nfc_shortcode( $atts ) {
	$atts    = shortcode_atts(
		array(
			'famille' => '',
			'mode'    => 'liste',
			'hauteur' => '900',
		),
		$atts,
		'next_formation_catalogue'
	);
	$famille = sanitize_text_field( (string) $atts['famille'] );
	$s       = nfc_settings();

	if ( 'iframe' === $atts['mode'] ) {
		if ( '' === $s['instance_url'] || '' === $s['org'] ) {
			return nfc_template( 'error', array( 'message' => "Catalogue non configuré : renseignez l'URL de l'instance et l'identifiant d'organisme." ) );
		}
		$src = $s['instance_url'] . '/embed/catalogue/' . rawurlencode( $s['org'] );
		if ( '' !== $famille ) {
			$src = add_query_arg( 'famille', rawurlencode( $famille ), $src );
		}
		return nfc_template(
			'iframe',
			array(
				'src'     => $src,
				'origin'  => nfc_origin( $s['instance_url'] ),
				'hauteur' => max( 300, absint( $atts['hauteur'] ) ),
			)
		);
	}

	wp_enqueue_style( 'nfc-catalogue', plugins_url( 'templates/catalogue.css', __FILE__ ), array(), NFC_VERSION );
	$data = nfc_fetch_catalogue( $famille );
	if ( is_wp_error( $data ) ) {
		return nfc_template( 'error', array( 'message' => $data->get_error_message() ) );
	}
	$slug = isset( $data['organismeSlug'] ) ? (string) $data['organismeSlug'] : $s['org'];
	return nfc_template(
		'catalogue',
		array(
			'data'        => $data,
			'famille'     => $famille,
			'public_base' => $s['instance_url'] . '/catalogue-public/' . rawurlencode( $slug ),
		)
	);
}
