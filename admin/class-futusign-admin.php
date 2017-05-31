<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://github.com/larkintuckerllc
 * @since      0.3.0
 *
 * @package    futusign
 * @subpackage futusign/admin
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}
/**
 * The admin-specific functionality of the plugin.
 *
 * @package    futusign
 * @subpackage futusign/admin
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_Admin {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.3.0
	 */
	public function __construct() {
	}
	public function admin_enqueue_scripts ( $hook_suffix ) {
		$cpt = 'futusign_screen';
		if( in_array( $hook_suffix, array( 'post.php' ) ) ){
			$screen = get_current_screen();
			if( is_object( $screen ) && $cpt == $screen->post_type ){
				// TODO: ADD SCRIPT TO LIST
				// Register, enqueue scripts and styles here
			}
		}
	}
}
