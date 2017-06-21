<?php

/**
 * The plugin bootstrap file
 *
 * @link             https://github.com/larkintuckerllc
 * @since            0.1.0
 * @package          futusign
 * @wordpress-plugin
 * Plugin Name:      futusign
 * Plugin URI:       https://github.com/larkintuckerllc/futusign
 * Description:      Manage and display digital signage content
 * Version:          2.4.2
 * Author:           John Tucker
 * Author URI:       https://github.com/larkintuckerllc
 * License:          GPL2 or later
 * License URI:      https://www.gnu.org/licenses/gpl.html
 * Text Domain:      futusign
 * Domain Path:      /languages
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}
function activate_futusign() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-futusign-activator.php';
	Futusign_Activator::activate();
}
function deactivate_futusign() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-futusign-deactivator.php';
	Futusign_Deactivator::deactivate();
}
register_activation_hook( __FILE__, 'activate_futusign' );
register_deactivation_hook( __FILE__, 'deactivate_futusign' );
require_once plugin_dir_path( __FILE__ ) . 'includes/class-futusign.php';
/**
 * Begins execution of the plugin.
 *
 * @since    0.3.0
 */
function run_futusign() {
	$plugin = new Futusign();
	$plugin->run();
}
run_futusign();
