package cz.angular.cordova.ws.media;

import com.mongodb.DBObject;
import com.wordnik.swagger.annotations.ApiModel;
import com.wordnik.swagger.annotations.ApiModelProperty;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import org.codehaus.jackson.map.ObjectMapper;

/**
 * HypermediaReponse: Class to be returned after getting methods of both RESTful and SOAP API called
 * 
 * Returns a list of DB records along with the associated Hypermedia URLs
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since March 2014
 */
@XmlRootElement(name = "bookstore")
//@ApiModel(value = "HypermediaResponse", description = "HypermediaResponse representation" )
public class HypermediaResponse {
	
	private static final Logger log = Logger.getLogger(HypermediaResponse.class.getName());
	
//	@ApiModelProperty(value = "List of records", required = false)
	private List<DBObject> _dbObjects = new ArrayList<>();
	private List<List<HypermediaLink>> _links = new ArrayList<>();
	
	/**
	 * Constructor
	 */
	public HypermediaResponse() { }
	
	/**
	 * Constructor
	 * @param a_dbObject
	 * @param a_links
	 */
	public HypermediaResponse(DBObject a_dbObject, List<List<HypermediaLink>> a_links) {
		this._dbObjects.clear();
		this._dbObjects.add(a_dbObject);
		this._links = a_links;
	}
	
	/**
	 * Constructor
	 * @param a_dbObjects
	 * @param a_links
	 */
	public HypermediaResponse(List<DBObject> a_dbObjects, List<List<HypermediaLink>> a_links) {
		this._dbObjects = a_dbObjects;
		this._links = a_links;
	}

	/**
	 * Get DB objects
	 * @return List<DBObject>
	 */
	@XmlTransient
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
	@XmlTransient
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
	
	/**
	 * Get the response in JSON format (used by SOAP services only)
	 * @return String
	 */
	@XmlElement(name = "response")
	public String getResponseAsJson() {
		return this.toString();
	}
	
	/**
	 * Get the response in XML format (used by SOAP services only)
	 * @return String
	 */
	@XmlTransient
	public String getResponseAsXml() {
		StringBuilder xml = new StringBuilder();
		
		for (DBObject dbObject : this.getDbObjects()) {
			xml.append("<record>");

			for (String key : dbObject.keySet()) {
				 xml.append("<").append(key).append(">").append(dbObject.get(key)).append("</").append(key).append(">");
			}
			xml.append("</record>");
		}
		
		return xml.toString();
	}
	
	/**
	 * Get the response in JSON format in order to pass it through to CXF-REST providers [JSON/JSONP/XML]
	 * @return String
	 */
	@Override
	public String toString() {
		try {
			return new ObjectMapper().writeValueAsString(new HypermediaObject(this.getDbObjects(), this.getLinks()));
		} catch (IOException ex) {
			log.log(Level.SEVERE, null, ex);
			return "{}";
		}
	}
}
