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
if ( ! defined( 'WPINC' ) ) {
	die;
}
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
	// DUPLICATED IN COMMON
	/**
	 * Flush on upgrade
	 *
	 * @since    2.2.1
	 */
	public function upgrader_process_complete() {
		flush_rewrite_rules();
	}
	// DUPLICATED IN COMMON
	/**
	 * Add rewrite rules
	 *
	 * @since    2.1.2
	 */
	public function add_rewrite_rules() {
		add_rewrite_rule( '^fs-endpoint/?', 'index.php?futusign_endpoint=1', 'top' );
	}
	/**
	 * Display missing plugin dependency notices.
	 *
	 * @since    0.3.0
	 */
	public function missing_plugins_notice() {
		if ( ! Futusign::is_plugin_active( 'acf' ) ) {
			include plugin_dir_path( __FILE__ ) . 'partials/futusign-missing-acf.php';
		}
	}
}
