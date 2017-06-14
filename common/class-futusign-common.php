<?php
/**
 * The common functionality of the plugin.
 *
 * @link       https://github.com/larkintuckerllc
 * @since      0.3.0
 *
 * @package    futusign
 * @subpackage futusign/common
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}
/**
 * The common functionality of the plugin.
 *
 * @package    futusign
 * @subpackage futusign/common
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_Common {
	/**
	 * The screen.
	 *
	 * @since    0.3.0
	 * @access   private
	 * @var      Futusign_Screen    $screen    The screen.
	 */
	private $screen;
	/**
	 * The slide deck.
	 *
	 * @since    0.3.0
	 * @access   private
	 * @var      Futusign_Slide_Deck    $slide_deck    The slide deck.
	 */
	private $slide_deck;
	/**
	 * The playlist.
	 *
	 * @since    0.3.0
	 * @access   private
	 * @var      Futusign_Playlist    $playlist    The playlist.
	 */
	private $playlist;
	/**
	 * The image.
	 *
	 * @since    2.0.0
	 * @access   private
	 * @var      Futusign_Image    $image    The image
	 */
	private $image;
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.3.0
	 */
	public function __construct() {
		$this->load_dependencies();
		$this->screen = new Futusign_Screen();
		$this->slide_deck = new Futusign_Slide_Deck();
		$this->playlist = new Futusign_Playlist();
		$this->image = new Futusign_Image();
	}
	/**
	 * Load the required dependencies for module.
	 *
	 * @since    0.3.0
	 * @access   private
	 */
	private function load_dependencies() {
		require_once plugin_dir_path( __FILE__ ) . 'class-futusign-screen.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-futusign-slide-deck.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-futusign-playlist.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-futusign-image.php';
	}
	/**
	 * Retrieve the screen.
	 *
	 * @since     0.3.0
	 * @return    Futusign_Screen    The screen functionality.
	 */
	public function get_screen() {
		return $this->screen;
	}
	/**
	 * Retrieve the slide deck.
	 *
	 * @since     0.3.0
	 * @return    Futusign_Slide_Deck    The slide deck functionality.
	 */
	public function get_slide_deck() {
		return $this->slide_deck;
	}
	/**
	 * Retrieve the playlist.
	 *
	 * @since     0.3.0
	 * @return    Futusign_Playlist    The playlist functionality.
	 */
	public function get_playlist() {
		return $this->playlist;
	}
	/**
 * Retrieve the image.
 *
 * @since     2.0.0
 * @return    Futusign_Image_Type    The image functionality.
 */
	public function get_image() {
		return $this->image;
	}
	/**
	 * Add rewrite rules
	 *
	 * @since    2.1.2
	 */
	public function add_rewrite_rules() {
		add_rewrite_rule( '^fs-endpoint/?', 'index.php?futusign_endpoint=1', 'top' );
	}
}
