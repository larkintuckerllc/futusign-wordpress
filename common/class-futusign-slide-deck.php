<?php
/**
 * Define the slide deck functionality
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
 * Define the slide deck functionality.
 *
 * @since      0.3.0
 * @package    futusign
 * @subpackage futusign/common
 * @author     John Tucker <john@larkintuckerllc.com>
 */
class Futusign_Slide_Deck {
/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.3.0
	 */
	public function __construct() {
	}
	/**
	 * Register the slide deck post type.
	 *
	 * @since    0.3.0
	 */
	public function register() {
		$labels = array(
			'name' => __( 'Slide Decks', 'futusign' ),
			'singular_name' => __( 'Slide Deck', 'futusign' ),
			'add_new' => __( 'Add New' , 'futusign' ),
			'add_new_item' => __( 'Add New Slide Deck' , 'futusign' ),
			'edit_item' =>  __( 'Edit Slide Deck' , 'futusign' ),
			'new_item' => __( 'New Slide Deck' , 'futusign' ),
			'view_item' => __('View Slide Deck', 'futusign'),
			'search_items' => __('Search Slide Decks', 'futusign'),
			'not_found' =>  __('No Slide Decks found', 'futusign'),
			'not_found_in_trash' => __('No Slide Decks found in Trash', 'futusign'),
		);
		register_post_type( 'futusign_slide_deck',
			array(
			'labels' => $labels,
			'public' => true,
			'exclude_from_search' => false,
			'publicly_queryable' => false,
			'show_in_nav_menus' => false,
			'has_archive' => false,
			'show_in_rest' => true,
			'rest_base' => 'fs-slide-decks',
			'menu_icon' => plugins_url( 'img/slide_deck.png', __FILE__ )
			)
		);
	}
	/**
	 * Values for playlist column.
	 *
	 * @since    0.3.0
	 * @param     string       $column     Column name.
	 * @param     string       $post_id    Post id.
	 */
	public static function manage_posts_custom_column( $column, $post_id ) {
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
	 * Add playlist column
	 *
	 * @since    0.3.0
	 * @param     array       $columns     Columns.
	 */
	public static function manage_posts_columns($columns) {
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
	 * Add playlist filter to admin.
	 *
	 * @since    0.3.0
	 */
	public static function restrict_manage_posts() {
		global $typenow;
		$post_type = 'futusign_slide_deck';
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
	 * @since    1.5.0
	 */
	public function restrict_manage_posts_override() {
		if (! class_exists( 'Futusign_Override' )) {
			return;
		}
		global $typenow;
		$post_type = 'futusign_slide_deck';
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
	 * Convert query for playlists from id to slug.
	 *
	 * @since    0.3.0
	 */
	public static function parse_query($wp_query) {
		global $pagenow;
		$post_type = 'futusign_slide_deck';
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
	 * @since    1.5.0
	 */
	public function parse_query_override($wp_query) {
		if (! class_exists( 'Futusign_Override' )) {
			return;
		}
		global $pagenow;
		$post_type = 'futusign_slide_deck';
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
	// TODO: DEPRECATED REPLACE WITH ACF_ADD_LOCAL_FIELD_GROUP
	public function register_field_group() {
		register_field_group(array (
		  'key' => 'acf_futusign_slide_decks',
			'id' => 'acf_futusign_slide_decks', // TODO: DEPRECATED REMOVE
			'title' => 'futusign Slide Decks',
			'fields' => array (
				array (
					'key' => 'field_acf_futusign_slide_decks_alert',
					'label' => __('Alert', 'futusign'),
					'name' => '',
					'type' => 'message',
					'message' => wp_kses(
						__( '<b><i>Slide Decks</i> have been deprecated and will be removed in a future version. Please see <a href="https://www.futusign.com/faq/" target="_blank">FAQ</a> for more details.</b>', 'futusign' ),
						array( 'i' => array(), 'b' => array(), 'a' => array( 'href' => array(), 'target' => array(), ), )
					)
				),
				array (
					'key' => 'field_5898796f0caa2', // STUCK WITH ORIGINAL FIELD KEY
					'label' => __('Instructions', 'futusign'),
					'name' => '',
					'type' => 'message',
					'message' => wp_kses(
						__( 'In addition to setting the <i>File</i>, etc., add the <i>Slide Deck</i> to one or more list below.', 'futusign' ),
						array( 'i' => array() )
					)
				),
				array (
					'key' => 'field_589877e070b27', // STUCK WITH ORIGINAL FIELD KEY
					'label' => __('File', 'futusign'),
					'name' => 'file',
					'type' => 'file',
					'instructions' => esc_html__('Upload a portable document format (PDF) file consisting of one or more slides.', 'futusign'),
					'required' => 1,
					'save_format' => 'url',
					'library' => 'all',
				),
				array (
					'key' => 'field_589878aaca56d', // STUCK WITH ORIGIN FIELD KEY
					'label' => __('Slide Duration', 'futusign'),
					'name' => 'slide_duration',
					'type' => 'number',
					'instructions' => esc_html__('The number of seconds to show each slide.', 'futusign'),
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
						'value' => 'futusign_slide_deck',
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
