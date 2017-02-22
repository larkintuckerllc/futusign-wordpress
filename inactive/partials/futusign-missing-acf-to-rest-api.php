<?php

/**
 * Missing acf-to-rest-api plugin partial.
 *
 * @link       https://github.com/larkintuckerllc
 * @since      0.3.0
 *
 * @package    futusign
 * @subpackage inactive/partials
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}
$is_installed = Futusign::is_plugin_installed( 'acf-to-rest-api' );
$target = false;
$action = __('Install', 'futusign');
if ( current_user_can( 'install_plugins' ) ) {
	if ( $is_installed ) {
		$action = __('Activate', 'futusign');
		$url = wp_nonce_url( self_admin_url( 'plugins.php?action=activate&plugin=' . $is_installed . '&plugin_status=active' ), 'activate-plugin_' . $is_installed );
	} else {
		$url = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=acf-to-rest-api' ), 'install-plugin_acf-to-rest-api' );
	}
} else {
	$target = true;
	$url = 'http://wordpress.org/plugins/acf-to-rest-api/';
}
?>
<div class="notice error is-dismissible">
	<p><strong>futusign</strong> <?php esc_html_e('depends on the last version of ACF REST API to work!', 'futusign' ); ?></p>
	<p><a href="<?php echo esc_url( $url ); ?>" class="button button-primary"<?php if ( $target ) : ?> target="_blank"<?php endif; ?>><?php echo esc_html( $action . ' ACF to REST API' ); ?></a></p>
</div>
