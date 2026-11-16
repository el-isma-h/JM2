<?php
/**
 * Template : widget en iframe. Variables : $src, $origin, $hauteur.
 *
 * @package next-formation-catalogue
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$nfc_frame_id = 'nfc-frame-' . wp_generate_uuid4();
?>
<iframe id="<?php echo esc_attr( $nfc_frame_id ); ?>" class="nfc-iframe" src="<?php echo esc_url( $src ); ?>" title="<?php echo esc_attr( 'Catalogue des formations' ); ?>" loading="lazy" style="width:100%;border:0;height:<?php echo esc_attr( (string) $hauteur ); ?>px"></iframe>
<script>
(function () {
	var frame = document.getElementById(<?php echo wp_json_encode( $nfc_frame_id ); ?>);
	var origin = <?php echo wp_json_encode( esc_url_raw( $origin ) ); ?>;
	window.addEventListener('message', function (e) {
		if (!frame || e.origin !== origin || e.source !== frame.contentWindow) return;
		if (e.data && e.data.type === 'next-formation:height' && typeof e.data.height === 'number') {
			frame.style.height = Math.max(300, Math.min(20000, Math.ceil(e.data.height))) + 'px';
		}
	});
})();
</script>
