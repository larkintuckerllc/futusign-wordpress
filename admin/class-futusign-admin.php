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
	/**
	 * Render Currently Playing Metabox for Screen
	 *
	 * @since    2.2.0
	 */
	public function render_screen_playing( $post ) {
		?>
		<div id="root"></div>

		<script>
			window.siteUrl = "<?php echo trailingslashit( site_url() );?>";
			window.screenId = <?php echo $post->ID; ?>;
			window.priority = <?php echo class_exists( 'Futusign_Priority' ) ? 'true' : 'false'; ?>;
		</script>
		<?php
	}
	/**
	 * Add Currently Playing Metabox for Screen
	 *
	 * @since    2.2.0
	 */
	public function add_meta_boxes_futusign_screen() {
		$screen = get_current_screen();
		if ( 'add' !== $screen->action ) {
			add_meta_box(
				'futusign_screen_playing',
				__( 'Currently Playing', 'futusign'),
				array($this, 'render_screen_playing'),
				'futusign_screen',
				'normal',
				'default'
	    );
		}
	}
	/**
	 * Enqueue Admin Scripts for Screen
	 *
	 * @since    2.2.0
	 * @param    string     $hook_suffix      The page.
	 */
	public function admin_enqueue_scripts ( $hook_suffix ) {
		$cpt = 'futusign_screen';
		if( in_array( $hook_suffix, array( 'post.php' ) ) ){
			$screen = get_current_screen();
			if( is_object( $screen ) && $cpt == $screen->post_type ){
				wp_register_script('futusign_admin_screen',
					plugin_dir_url( __FILE__ ) . 'screen/dist/main.bundle.js',
					array(),
					'2017053101', true
				);
				wp_enqueue_script('futusign_admin_screen');
			}
		}
	}
}
