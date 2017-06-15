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
					'2017060701', true
				);
				wp_enqueue_script('futusign_admin_screen');
			}
		}
	}
	/**
	 * Define settings
	 *
	 * @since    2.4.0
	 */
	public function admin_init() {
		register_setting(
			'futusign_option_group',
			'futusign_option_name',
			array( $this, 'sanitize_callback')
		);
		add_settings_section(
			'futusign_reload_section',
			'Reload',
			array ( $this, 'reload_section_callback'),
			'futusign_settings_page');
		add_settings_field(
			'version',
			'version',
			array ( $this, 'version' ),
			'futusign_settings_page',
			'futusign_reload_section'
		);
	}
	/**
	 * Sanitize inputs
	 *
	 * @since   2.4.0
	 * @param    array      $input     input
	 * @return   array      sanitized input
	 */
	public function sanitize_callback($input) {
		$newinput = array();
		$newinput['version'] = trim($input['version']);
		return $newinput;
	}
	/**
	 * Reload section copy
	 *
	 * @since    2.4.0
	 */
	public function reload_section_callback() {
		?>
		<p>Update version to force all screen players to reload at their next poll.</p>
		<?php
	}
	/**
	 * version Input
	 *
	 * @since    2.4.0
	 */
	public function version() {
		$options = get_option('futusign_option_name');
		echo "<input id='version' name='futusign_option_name[version]' size='40' type='text' value='{$options['version']}' />";
	}
	/**
	 * Add admin menus
	 *
	 * @since    2.4.0
	 */
	public function admin_menu() {
		add_options_page(
			'futusign',
			'futusign',
			'manage_options',
			'futusign_options',
			array( $this, 'options_page' )
		);
	}
	/**
	 * Display settings page
	 *
	 * @since    2.4.0
	 */
	public function options_page() {
		?>
		<div class="wrap">
			<h1>futusign Settings</h1>
			<form action="options.php" method="post">
				<?php settings_fields('futusign_option_group'); ?>
				<?php do_settings_sections('futusign_settings_page'); ?>
				<input
					name="Submit"
					type="submit"
					value="<?php esc_attr_e('Save Changes', 'futusign'); ?>"
					class="button button-primary"
				/>
			</form>
		</div>
		<?php
	}
}
