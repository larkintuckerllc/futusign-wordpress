<?php
/**
 * Define the internationalization functionality
 *
 * @link       https://github.com/larkintuckerllc
 * @since      0.3.0
 *
 * @package    futusign
 * @subpackage futusign/includes
 */
if ( ! defined( 'WPINC' ) ) {
	die;
} 
/**
 * Define the internationalization functionality.
 *
 * @since      0.3.0
 * @package    futusign
 * @subpackage futusign/includes
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_i18n {
	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    0.3.0
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			'futusign',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);
	}
}
