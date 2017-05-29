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
	die;
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
		return $query_vars;
	}
	/**
	 * Define futusign-monitor endpoint
	 *
	 * @since    2.1.2
	 * @param    array      $query     query
	 */
	public function parse_request( $query ) {
		if ( array_key_exists( 'futusign_endpoint', $query->query_vars ) ) {
			include 'partials/futusign-endpoint.php';
			exit();
		}
		return;
	}
}
