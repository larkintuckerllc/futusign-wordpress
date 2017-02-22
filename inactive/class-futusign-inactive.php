<?php
/**
 * The common functionality of the plugin.
 *
 * @link       https://github.com/larkintuckerllc
 * @since      0.3.0
 *
 * @package    futusign
 * @subpackage futusign/inactive
 */
/**
 * The inactive functionality of the plugin.
 *
 * @package    futusign
 * @subpackage futusign/inactive
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_Inactive {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.3.0
	 */
	public function __construct() {
	}
	/**
	 * Display missing plugin dependency notices.
	 *
	 * @since    0.3.0
	 */
	public function missing_plugins_notice() {
		if ( ! Futusign::is_plugin_active( 'acf-to-rest-api' ) ) {
			include plugin_dir_path( __FILE__ ) . 'partials/futusign-missing-acf-to-rest-api.php';
		}
	}
}
