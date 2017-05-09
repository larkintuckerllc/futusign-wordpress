<?php
/**
 * Define the image functionality
 *
 * @link       https://github.com/larkintuckerllc
 * @since      2.0.0
 *
 * @package    futusign
 * @subpackage futusign/common
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}
/**
 * Define the image functionality.
*
 * @since      2.0.0
 * @package    futusign
 * @subpackage futusign/common
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_Image {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    2.0.0
	 */
	public function __construct() {
	}
	/**
	 * Register the image post type.
	 *
	 * @since    2.0.0
	 */
	public function register() {
		$labels = array(
			'name' => __( 'Images', 'futusign' ),
			'singular_name' => __( 'Image', 'futusign' ),
			'add_new' => __( 'Add New' , 'futusign' ),
			'add_new_item' => __( 'Add New Image' , 'futusign' ),
			'edit_item' =>  __( 'Edit Image' , 'futusign' ),
			'new_item' => __( 'New Image' , 'futusign' ),
			'view_item' => __('View Image', 'futusign'),
			'search_items' => __('Search Images', 'futusign'),
			'not_found' =>  __('No Images found', 'futusign'),
			'not_found_in_trash' => __('No Images found in Trash', 'futusign'),
		);
		register_post_type( 'futusign_image',
			array(
				'labels' => $labels,
				'public' => true,
				'exclude_from_search' => false,
				'publicly_queryable' => false,
				'show_in_nav_menus' => false,
				'has_archive' => false,
				'show_in_rest' => true,
				'rest_base' => 'fs-images',
				'menu_icon' => plugins_url( 'img/image.png', __FILE__ )
			)
		);
	}
	/**
	 * Return the playlists for an image.
	 *
	 * @since    2.0.0
	 * @param    string     $column      The column name.
	 * @param    string     $post_id     The post id.
	 */
	public function manage_posts_custom_column( $column, $post_id ) {
		switch ( $column ) {
			case 'playlists':
				$playlists = get_the_terms( $post_id, 'futusign_playlist' );
				if ($playlists == false) {
					echo '';
				} else {
					echo join( ', ', wp_list_pluck( $playlists, 'name' ) );
				}
				break;
			case 'overrides':
				$overrides = get_the_terms( $post_id, 'futusign_override' );
				if ($overrides == false) {
					echo '';
				} else {
					echo join( ', ', wp_list_pluck( $overrides, 'name' ) );
				}
				break;
		}
	}
	/**
	 * Insert playlists column for an image.
	 *
	 * @since    2.0.0
	 * @param    array     $columns      The columns.
	 */
	public function manage_posts_columns($columns) {
		$i = array_search( 'title', array_keys( $columns ) ) + 1;
		$columns_before = array_slice( $columns, 0, $i );
		$columns_after = array_slice( $columns, $i );
		$overrides = array();
		if (class_exists( 'Futusign_Override' )) {
			$overrides = array(
				'overrides' => __('On Overrides', 'futusign')
			);
		}
		return array_merge(
			$columns_before,
			array(
				'playlists' => __('On Playlists', 'futusign')
			),
			$overrides,
			$columns_after
		);
	}
	/**
	 * Build filter admin selection.
	 *
	 * @since    2.0.0
	 */
	public function restrict_manage_posts() {
		global $typenow;
		$post_type = 'futusign_image';
		$taxonomy_id = 'futusign_playlist';
		if ($typenow != $post_type) {
			return;
		}
		$selected = isset( $_GET[$taxonomy_id] ) ? $_GET[$taxonomy_id] : '';
		$taxonomy = get_taxonomy( $taxonomy_id );
		wp_dropdown_categories( array(
			'show_option_all' =>  __( 'Show All', 'futusign' ) . ' ' . $taxonomy->label,
			'taxonomy' => $taxonomy_id,
			'name' => $taxonomy_id,
			'orderby' => 'name',
			'selected' => $selected,
			'show_count' => false,
			'hide_empty' => false,
			'hide_if_empty' => true,
		) );
	}
	/**
	 * Build filter admin selection for overide
	 *
	 * @since    2.0.0
	 */
	public function restrict_manage_posts_override() {
		if (! class_exists( 'Futusign_Override' )) {
			return;
		}
		global $typenow;
		$post_type = 'futusign_image';
		$taxonomy_id = 'futusign_override';
		if ($typenow != $post_type) {
			return;
		}
		$selected = isset( $_GET[$taxonomy_id] ) ? $_GET[$taxonomy_id] : '';
		$taxonomy = get_taxonomy( $taxonomy_id );
		wp_dropdown_categories( array(
			'show_option_all' =>  __( 'Show All', 'futusign' ) . ' ' . $taxonomy->label,
			'taxonomy' => $taxonomy_id,
			'name' => $taxonomy_id,
			'orderby' => 'name',
			'selected' => $selected,
			'show_count' => false,
			'hide_empty' => false,
			'hide_if_empty' => true,
		) );
	}
	/**
	 * Convert query playlists variables from ids to slugs
	 *
	 * @since    2.0.0
	 */
	public function parse_query($wp_query) {
		global $pagenow;
		$post_type = 'futusign_image';
		$taxonomy_id = 'futusign_playlist';
		$q_vars = &$wp_query->query_vars;
		if (
			$pagenow != 'edit.php' ||
			!isset( $q_vars['post_type'] ) ||
			$q_vars['post_type'] !== $post_type ||
			!isset( $q_vars[$taxonomy_id] ) ||
			!is_numeric( $q_vars[$taxonomy_id] ) ||
			$q_vars[$taxonomy_id] == 0
		) {
			return;
		}
		$term = get_term_by( 'id', $q_vars[$taxonomy_id], $taxonomy_id );
		$q_vars[$taxonomy_id] = $term->slug;
	}
	/**
	 * Convert query playlists variables from ids to slugs - override
	 *
	 * @since    2.0.0
	 */
	public function parse_query_override($wp_query) {
		if (! class_exists( 'Futusign_Override' )) {
			return;
		}
		global $pagenow;
		$post_type = 'futusign_image';
		$taxonomy_id = 'futusign_override';
		$q_vars = &$wp_query->query_vars;
		if (
			$pagenow != 'edit.php' ||
			!isset( $q_vars['post_type'] ) ||
			$q_vars['post_type'] !== $post_type ||
			!isset( $q_vars[$taxonomy_id] ) ||
			!is_numeric( $q_vars[$taxonomy_id] ) ||
			$q_vars[$taxonomy_id] == 0
		) {
			return;
		}
		$term = get_term_by( 'id', $q_vars[$taxonomy_id], $taxonomy_id );
		$q_vars[$taxonomy_id] = $term->slug;
	}
	/**
	 * Define advanced custom fields for youtube video.
	 *
	 * @since    2.0.0
	 */
	// TODO: DEPRECATED REPLACE WITH ACF_ADD_LOCAL_FIELD_GROUP
	public function register_field_group() {
		if( function_exists( 'register_field_group' ) ) {
			register_field_group(array (
				'id' => 'acf_futusign_images', // TODO: DEPRECATED
				'key' => 'acf_futusign_images',
				'title' => 'futusign Images',
				'fields' => array (
					array (
						'key' => 'field_acf_futusign_images_instructions',
						'label' => __('Instructions', 'futusign'),
						'name' => '',
						'type' => 'message',
						'message' => wp_kses(__( 'In addition to setting the <i>File</i>, etc., add the <i>Image</i> to one or more <i>list</i> below.', 'futusign' ), array( 'i' => array() ) ),
					),
					array (
						'key' => 'field_acf_futusign_images_file',
						'label' => __('File', 'futusign'),
						'name' => 'file',
						'type' => 'image',
						'instructions' => __('Upload an image file.', 'futusign'),
						'required' => 1,
						'save_format' => 'url',
						'preview_size' => 'thumbnail',
						'library' => 'all',
					),
					array (
						'key' => 'field_acf_futusign_images_image_duration',
						'label' => __('Image Duration', 'futusign'),
						'name' => 'image_duration',
						'type' => 'number',
						'instructions' => esc_html__('The number of seconds to show image.', 'futusign'),
						'required' => 1,
						'default_value' => 10,
						'placeholder' => '',
						'prepend' => '',
						'append' => '',
						'min' => 2,
						'max' => '',
						'step' => 1,
					),
				),
				'location' => array (
					array (
						array (
							'param' => 'post_type',
							'operator' => '==',
							'value' => 'futusign_image',
							'order_no' => 0,
							'group_no' => 0,
						),
					),
				),
				'options' => array (
					'position' => 'normal',
					'layout' => 'no_box',
					'hide_on_screen' => array (
						0 => 'permalink',
						1 => 'the_content',
						2 => 'excerpt',
						3 => 'discussion',
						4 => 'comments',
						5 => 'revisions',
						6 => 'slug',
						7 => 'author',
						8 => 'format',
						9 => 'featured_image',
						10 => 'categories',
						11 => 'tags',
						12 => 'send-trackbacks',
					),
				),
				'menu_order' => 0,
			));
		}
	}
}
