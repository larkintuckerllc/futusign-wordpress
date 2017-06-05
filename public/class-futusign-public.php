<?php
/**
 * The public-specific functionality of the plugin.
 *
 * @link       https://github.com/larkintuckerllc
 * @since      0.3.0
 *
 * @package    futusign
 * @subpackage futusign/public
 */
if ( ! defined( 'WPINC' ) ) {
	die();
}
/**
 * The public-specific functionality of the plugin.
 *
 * @package    futusign
 * @subpackage futusign/public
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_Public {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.3.0
	 */
	public function __construct() {
	}
	/**
	 * Return single templates
	 *
	 * @since    0.3.0
	 * @param    string      $single     path to template
	 * @return   string      path to template
	 */
	public function single_template( $single ) {
		global $post;
		if ($post->post_type == 'futusign_screen'){
			return plugin_dir_path( __FILE__ ) . 'screen/dist/futusign-screen.php';
		}
		return $single;
	}
	/**
	 * Add to query variables
	 *
	 * @since    2.1.2
	 * @param    array      $query_vars     query variables
	 * @return   array      query variables
	 */
	public function query_vars( $query_vars ) {
    $query_vars[] = 'futusign_endpoint';
		$query_vars[] = 'futusign_screen_id';
		$query_vars[] = 'futusign_debug';
		return $query_vars;
	}
	/**
	 * Define futusign-monitor endpoint
	 *
	 * @since    2.1.2
	 * @param    array      $query     query
	 */
	public function parse_request( $query ) {
		$query_vars = $query->query_vars;
		$debug = null;
		if ( array_key_exists( 'futusign_debug', $query_vars ) ) {
			$debug = $query_vars['futusign_debug'];
		}
		// DEBUG 0
		if ($debug === '0') {
			echo '0';
			die();
		}
		if ( array_key_exists( 'futusign_endpoint', $query_vars ) ) {
			// DEBUG 1
			if ($debug === '1') {
				echo '1';
				die();
			}
			if ( array_key_exists( 'futusign_screen_id', $query_vars ) ) {
				// DEBUG 2
				if ($debug === '2') {
					echo '2';
					die();
				}
				require 'partials/futusign-endpoint.php';
				// DEBUG 3
				if ($debug === '3') {
					echo '3';
					die();
				}
				futusign_endpoint($query_vars['futusign_screen_id'], $debug);
			} else {
				status_header(400);
			}
			exit();
		}
		return;
	}
}
