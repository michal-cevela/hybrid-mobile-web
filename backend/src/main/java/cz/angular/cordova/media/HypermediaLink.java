package cz.angular.cordova.media;

import java.util.logging.Logger;

/**
 * Link: URL to be provided along with a database record
 * 
 * Follows the concept of building Hypermedia-driven RESTful APIs
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since April 2014
 */
public class HypermediaLink {
	
	private static final Logger log = Logger.getLogger(HypermediaLink.class.getName());
	
	private String _action;
	private String _url;
	
	/**
	 * Constructor
	 */
	public HypermediaLink() {}

	/**
	 * Get the action
	 * @return String
	 */
	public String getAction() {
		return this._action;
	}

	/**
	 * Set an action
	 * @param a_action 
	 */
	public void setAction(String a_action) {
		this._action = a_action;
	}

	/**
	 * Get the URL
	 * @return String
	 */
	public String getUrl() {
		return this._url;
	}

	/**
	 * Set an URL
	 * @param a_url
	 */
	public void setUrl(String a_url) {
		this._url = a_url;
	}
}
