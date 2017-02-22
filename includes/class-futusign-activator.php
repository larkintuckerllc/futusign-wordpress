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
		$screen = new Futusign_Screen();
		$slide_deck = new Futusign_Slide_Deck();
 		$playlist = new Futusign_Playlist();
		$screen->register();
		$slide_deck->register();
		$playlist->register();
		flush_rewrite_rules();
	}
}
