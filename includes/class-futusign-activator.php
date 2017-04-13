<?php

/**
 * Fired during plugin activation
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
 * Fired during plugin activation.
 *
 * @since      0.3.0
 * @package    futusign
 * @subpackage futusign/includes
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_Activator {
	/**
	 * Fired during plugin activation.
	 *
	 * @since    0.3.0
	 */
	public static function activate() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'common/class-futusign-common.php';
		$plugin_common = new Futusign_Common();
		$screen = $plugin_common->get_screen();
		$slide_deck = $plugin_common->get_slide_deck();
    $playlist = $plugin_common->get_playlist();
		$screen->register();
		$slide_deck->register();
		$playlist->register();
		flush_rewrite_rules();
	}
}
