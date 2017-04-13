<?php

/**
 * Fired during plugin deactivation
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
 * Fired during plugin deactiviation.
 *
 * @since      0.3.0
 * @package    futusign
 * @subpackage futusign/includes
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_Deactivator {
	/**
	 * Fired during plugin deactivation.
	 *
	 * @since    0.3.0
	 */
	public static function deactivate() {
		flush_rewrite_rules();
	}
}
