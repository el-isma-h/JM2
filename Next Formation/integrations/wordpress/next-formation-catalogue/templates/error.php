<?php
/**
 * Template : message d'erreur (visible des administrateurs seulement ; les visiteurs voient un message neutre).
 * Variable : $message.
 *
 * @package next-formation-catalogue
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<p class="nfc-error"><?php echo esc_html( current_user_can( 'manage_options' ) ? (string) $message : 'Le catalogue des formations est momentanément indisponible.' ); ?></p>
