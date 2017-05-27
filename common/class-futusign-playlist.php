<?php
/**
 * Define the playlist functionality
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
 * Define the playlist functionality.
 *
 * @since      0.3.0
 * @package    futusign
 * @subpackage futusign/common
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_Playlist {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.3.0
	 */
	public function __construct() {
	}
	/**
	 * Register the playlist taxonomy.
	 *
	 * @since    0.3.0
	 */
	public function register() {
		$object_types = array( 'futusign_slide_deck', 'futusign_screen', 'futusign_image' );
		if (class_exists( 'Futusign_Web' )) {
			array_push( $object_types, 'futusign_web' );
		}
		if (class_exists( 'Futusign_Youtube' )) {
			array_push( $object_types, 'futusign_yt_video' );
		}
		if (class_exists( 'Futusign_Layer' )) {
			array_push( $object_types, 'futusign_layer' );
		}
		if (class_exists( 'Futusign_MediaDeck' )) {
			array_push( $object_types, 'futusign_media_deck' );
		}
		$labels = array(
			 'name' => __( 'Playlists', 'futusign' ),
			 'singular_name' => __( 'Playlist', 'futusign' ),
			 'all_items' => __( 'All Playlists', 'futusign' ),
			 'edit_item' =>  __( 'Edit Playlist' , 'futusign' ),
			 'view_item' => __('View Playlist', 'futusign'),
			 'update_item' => __('Update Playlist', 'futusign'),
			 'add_new_item' => __( 'Add New Playlist' , 'futusign' ),
			 'new_item_name' => __( 'New Playlist' , 'futusign' ),
			 'search_items' => __( 'Search Playlists', 'futusign' ),
			 'popular_items' => __( 'Popular Playlists', 'futusign' ),
			 'add_or_remove_items' => __( 'Add or remove playlists', 'futusign' ),
			 'choose_from_most_used' => __( 'Choose from the most used playlists.', 'futusign' ),
			 'not_found' =>  __('No Playlists found', 'futusign'),
		);
		register_taxonomy(
			'futusign_playlist',
			$object_types,
			array(
				'labels' => $labels,
				'rewrite' => false,
				'query_var' => true,
				'public' => true,
				'publicly_queryable' => false,
				'hierarchical' => true,
				'show_in_rest' => true,
				'rest_base' => 'fs-playlists',
			)
		);
	}
}
