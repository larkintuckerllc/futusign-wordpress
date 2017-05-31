<?php
/**
 * Missing acf plugin partial.
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
/**
 * Show missing acf
 *
 * @since    0.3.0
 */
function futusign_missing_acf() {
	$is_installed = Futusign::is_plugin_installed( 'acf' );
	$target = false;
	$action = __('Install', 'futusign');
	if ( current_user_can( 'install_plugins' ) ) {
		if ( $is_installed ) {
			$action = __('Activate', 'futusign');
			$url = wp_nonce_url( self_admin_url( 'plugins.php?action=activate&plugin=' . $is_installed . '&plugin_status=active' ), 'activate-plugin_' . $is_installed );
		} else {
			$url = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=advanced-custom-fields' ), 'install-plugin_advanced-custom-fields' );
		}
	} else {
		$target = true;
		$url = 'http://wordpress.org/plugins/acf/';
	}
	?>
	<div class="notice error is-dismissible">
		<p><strong>futusign</strong> <?php esc_html_e('depends on the last version of Advanced Custom Fields to work!', 'futusign' ); ?></p>
		<p><a href="<?php echo esc_url( $url ); ?>" class="button button-primary"<?php if ( $target ) : ?> target="_blank"<?php endif; ?>><?php echo esc_html( $action . ' Advanced Custom Fields' ); ?></a></p>
	</div>
	<?php
}
futusign_missing_acf();
