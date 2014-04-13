package cz.angular.cordova.media;

import com.mongodb.DBObject;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

/**
 * HypermediaObject: Object to represent a hypermedia-based response
 * 
 * Follows the concept of building Hypermedia-driven RESTful APIs
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since April 2014
 */
public class HypermediaObject {
	
	private static final Logger log = Logger.getLogger(HypermediaObject.class.getName());
	
	private List<DBObject> _dbObjects = new ArrayList<>();
	private List<List<HypermediaLink>> _links = new ArrayList<>();
	
	/**
	 * Constructor
	 */
	public HypermediaObject() {}
	
	/**
	 * Constructor
	 * @param a_dbObjects
	 * @param a_links 
	 */
	public HypermediaObject(List<DBObject> a_dbObjects, List<List<HypermediaLink>> a_links) {
		this._dbObjects = a_dbObjects;
		this._links = a_links;
	}

	/**
	 * Get DB objects
	 * @return List<DBObject>
	 */
	public List<DBObject> getDbObjects() {
		return this._dbObjects;
	}

	/**
	 * Set DB objects
	 * @param a_dbObjects
	 */
	public void setDbObjects(List<DBObject> a_dbObjects) {
		this._dbObjects = a_dbObjects;
	}

	/**
	 * Get the hypermedia links
	 * @return List<List<HypermediaLink>>
	 */
	public List<List<HypermediaLink>> getLinks() {
		return this._links;
	}

	/**
	 * Set the hypermedia links
	 * @param a_links
	 */
	public void setLinks(List<List<HypermediaLink>> a_links) {
		this._links = a_links;
	}
}
