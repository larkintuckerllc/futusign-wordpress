<?php
/**
 * Define the screen functionality
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
 * Define the screen functionality.
 *
 * @since      0.3.0
 * @package    futusign
 * @subpackage futusign/common
 * @author     John Tucker <john@larkintuckerllc.com>
 */
 class Futusign_Screen {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    0.3.0
	 */
	public function __construct() {
	}
	/**
	 * Register the screen post type.
	 *
	 * @since    0.3.0
	 */
	public function register() {
		 $labels = array(
			'name' => __( 'Screens', 'futusign' ),
			'singular_name' => __( 'Screen', 'futusign' ),
			'add_new' => __( 'Add New' , 'futusign' ),
			'add_new_item' => __( 'Add New Screen' , 'futusign' ),
			'edit_item' =>  __( 'Edit Screen' , 'futusign' ),
			'new_item' => __( 'New Screen' , 'futusign' ),
			'view_item' => __('View Screen', 'futusign'),
			'search_items' => __('Search Screens', 'futusign'),
			'not_found' =>  __('No Screens found', 'futusign'),
			'not_found_in_trash' => __('No Screens found in Trash', 'futusign'),
		);
		register_post_type( 'futusign_screen',
			array(
				'labels' => $labels,
				'public' => true,
				'publicly_queryable' => true,
				'rewrite' => array('slug' => 'fs-screens'),
				'has_archive' => false,
				'show_in_rest' => true,
				'rest_base' => 'fs-screens',
        'menu_icon' => plugins_url( 'img/screen.png', __FILE__ )
			)
		);
	}
	/**
	 * Return the playlists for a screen.
	 *
	 * @since    0.3.0
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
	 * Insert playlists column for a screen.
	 *
	 * @since    0.3.0
	 * @param    array     $columns      The columns.
	 */
	public function manage_posts_columns($columns) {
		$i = array_search( 'title', array_keys( $columns ) ) + 1;
		$columns_before = array_slice( $columns, 0, $i );
		$columns_after = array_slice( $columns, $i );
		$overrides = array();
		if (class_exists( 'Futusign_Override' )) {
			$overrides = array(
				'overrides' => __('Subscribed Overrides', 'futusign')
			);
		}
		return array_merge(
			$columns_before,
			array(
				'playlists' => __('Subscribed Playlists', 'futusign')
			),
			$overrides,
			$columns_after
		);
	}
	/**
	 * Build filter admin selection.
	 *
	 * @since    0.3.0
	 */
	public function restrict_manage_posts() {
		global $typenow;
		$post_type = 'futusign_screen';
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
		$post_type = 'futusign_screen';
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
	 * @since    0.3.0
	 */
	public function parse_query($wp_query) {
		global $pagenow;
		$post_type = 'futusign_screen';
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
		$post_type = 'futusign_screen';
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
	 * Define advanced custom fields for screen.
	 *
	 * @since    0.3.0
	 */
  // TODO: DEPRECATED REPLACE WITH ACF_ADD_LOCAL_FIELD_GROUP
  public function register_field_group() {
    register_field_group(array (
      'key' => 'acf_futusign_screens',
      'id' => 'acf_futusign_screens', // TODO: DEPREICATED REMOVE
      'title' => 'futusign Screens',
      'fields' => array (
        array (
          'key' => 'field_acf_futusign_screens_instructions',
          'label' => __('Instructions', 'futusign'),
          'name' => '',
          'type' => 'message',
          'message' => wp_kses(
            __( 'Used to create an Uniform Resource Locator (URL) or address for a <i>Screen</i>, additionally add it to one or more lists below.', 'futusign' ),
            array( 'i' => array() )
          )
        ),
				array (
					'key' => 'field_acf_fs_sc_polling',
					'label' => __('Polling Cycle', 'futusign'),
					'name' => 'polling',
					'type' => 'number',
					'instructions' => esc_html__('The number of minutes between polling for updates', 'futusign'),
					'required' => 1,
					'default_value' => 60,
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'min' => 1,
					'max' => '',
					'step' => 1,
				),
      ),
      'location' => array (
        array (
          array (
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'futusign_screen',
            'order_no' => 0,
            'group_no' => 0,
          ),
        ),
      ),
      'options' => array (
        'position' => 'normal',
        'layout' => 'no_box',
        'hide_on_screen' => array (
          0 => 'the_content',
          1 => 'excerpt',
          2 => 'discussion',
          3 => 'comments',
          4 => 'revisions',
          5 => 'slug',
          6 => 'author',
          7 => 'format',
          8 => 'featured_image',
          9 => 'categories',
          10 => 'tags',
          11 => 'send-trackbacks',
        ),
      ),
      'menu_order' => 0,
    ));
  }
}
