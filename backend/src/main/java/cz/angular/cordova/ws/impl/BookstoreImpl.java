package cz.angular.cordova.ws.impl;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.WriteResult;
import com.mongodb.util.JSON;
import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import cz.angular.cordova.ws.media.HypermediaLink;
import cz.angular.cordova.ws.media.HypermediaResponse;
import cz.angular.cordova.ws.Bookstore;
import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.jws.WebService;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
//import org.apache.cxf.rs.security.cors.CrossOriginResourceSharing;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

/**
 * Bookstore: Implementation of RESTful & SOAP Service
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since March 2014
 */
@WebService(serviceName = "Bookstore", portName = "BookstorePort")
@Service("Bookstore-API")
@Path("/bookstore")
@Api(value="/bookstore", description="Bookstore API")
@Produces({
	"application/javascript;charset=UTF-8",
	"application/json;charset=UTF-8",
	"application/xml;charset=UTF-8"
})
public class BookstoreImpl implements Bookstore {
/*
	@Context
	private javax.ws.rs.core.HttpHeaders headers;
	private javax.ws.rs.core.UriInfo uri;
	private javax.servlet.http.HttpServletRequest request;
	private javax.servlet.http.HttpServletResponse response;
	private javax.ws.rs.core.SecurityContext security;
*/
	private static final Logger log = Logger.getLogger(BookstoreImpl.class.getName());
	
	private final Map<String, DB> _dbs = new HashMap<>();
	private final boolean _isAuthorized = true;
	private final List<List<HypermediaLink>> _links = new ArrayList<>();
	
	/**
	 * Constructor
	 */
	public BookstoreImpl() {
		log.info("Bookstore : REST API has been initialized...");
	}
	
	/**
	 * Get a reference to a MongoDB database
	 * @param a_dbName
	 * @param a_user
	 * @param a_pwd
	 * @return DB
	 * @throws UnknownHostException 
	 */
	private DB getDB(String a_dbName, String a_user, String a_pwd)
			  throws UnknownHostException {
		DB db;
		
		if (_dbs.containsKey(a_dbName)) {
			db = _dbs.get(a_dbName);
		} else {
			db = new MongoClient().getDB(a_dbName);

			if ( (a_user != null) && (a_pwd != null) ) {
				if (db.authenticate(a_user, a_pwd.toCharArray()) == false) {
					db = null;
				}
			}
			
			if (db != null) {
				_dbs.put(a_dbName, db);
			}
		}
		
		return db;
	}
	
	/**
	 * Get a reference to a DB collection
	 * @param a_dbName
	 * @param a_collName
	 * @return DBCollection
	 * @throws UnknownHostException 
	 */
	private DBCollection getCollection(String a_dbName, String a_collName)
			  throws UnknownHostException {
		DB bookstoreDB = this.getDB(a_dbName, null, null);
		return bookstoreDB.getCollection(a_collName);
	}
/*	
	@Path("books/async")
	@GET
	@Asynchronous
	public void hello(@CookieParam("sessionId") string id, @Suspended final AsyncResponse response) {
		response.resume("Hello async world!");
	}
*/
	@Path("/books/list")
	@GET
	@ApiOperation(
		value = "Get a list of books",
		response = HypermediaResponse.class
	)
	@Override
	public HypermediaResponse getBooksList() throws UnknownHostException {
		DBCollection bookColl = this.getCollection("bookstore", "book");
		DBCursor cursor = bookColl.find(new BasicDBObject(), new BasicDBObject(/* "_id", 0 */));
		cursor.sort(new BasicDBObject("price", -1)); // +1: ASC, -1: DESC
		
		List<DBObject> dbObjects = cursor.toArray();
		this._links.clear();
		
		for (DBObject dbObject : dbObjects) {
			List<HypermediaLink> link = new ArrayList<>();
			link.add(new HypermediaLink());
			this._links.add(link);
		}
		
		return new HypermediaResponse(dbObjects, this._links);
	}

	@Path("/book/detail")
	@GET
	@ApiOperation(
		value = "Get a book detail",
		response = HypermediaResponse.class
	)
	@Override
	public HypermediaResponse getBook(@ApiParam(value="id") @QueryParam("id") String id)
			  throws UnknownHostException {
		log.log(Level.INFO, "Book ID: {0}", id);
		
		DBCollection bookColl = this.getCollection("bookstore", "book");
		DBObject book = bookColl.findOne(new BasicDBObject("_id", new ObjectId(id)), new BasicDBObject());
		
		List<HypermediaLink> link = new ArrayList<>();
		link.add(new HypermediaLink());
		this._links.clear();
		this._links.add(link);
		
		return new HypermediaResponse(book, this._links);
	}
	
	@Path("/book/new")
	@POST
	@ApiOperation(
		value = "Add a new book",
		response = HypermediaResponse.class
	)
	@Override
	public HypermediaResponse addBook(@ApiParam(value="json") String payload)
			  throws UnknownHostException, Exception {
		log.log(Level.INFO, "Payload: {0}", payload);

		DBCollection bookColl = this.getCollection("bookstore", "book");
		DBObject newBook = (BasicDBObject) JSON.parse(payload);
		WriteResult result = bookColl.insert(newBook);

		if (result.getError() == null) {
			List<HypermediaLink> link = new ArrayList<>();
			link.add(new HypermediaLink());
			this._links.clear();
			this._links.add(link);

			return new HypermediaResponse(newBook, this._links);
		} else {
			throw new Exception("An error occured when adding a new record!");
		}
	}
	
	@Path("/book/update/{id}")
	@PUT
	@Consumes("application/json;charset=UTF-8")
	@ApiOperation(
		value = "Update an existing book",
		response = HypermediaResponse.class
	)
	@Override
	public HypermediaResponse updateBook(@ApiParam(value="id") @PathParam("id") String id, @ApiParam(value="json") String payload)
			  throws IOException, Exception {
		log.log(Level.INFO, "Book ID: {0}", id);
		log.log(Level.INFO, "Payload: {0}", payload);
		
		DBCollection bookColl = this.getCollection("bookstore", "book");
		DBObject oldBook = bookColl.findOne(new BasicDBObject("_id", new ObjectId(id)), new BasicDBObject());
		DBObject newBook = (BasicDBObject) JSON.parse(payload);
//		newBook.append("$set", new BasicDBObject().append("newKey", "newValue"));
		
		if ( (oldBook != null) && (newBook != null) ) {
			WriteResult result = bookColl.update(oldBook, newBook);
			
			if (result.getError() == null) {
				List<HypermediaLink> link = new ArrayList<>();
				link.add(new HypermediaLink());
				this._links.clear();
				this._links.add(link);

				return new HypermediaResponse(newBook, this._links);
			} else {
				throw new Exception("An error occured when updating an existing record!");
			}
		} else {
			throw new Exception("An existing record has not been found!");
		}
	}
	
	@Path("/book/delete/{id}")
	@DELETE
	@ApiOperation(
		value = "Delete an existing book",
		response = HypermediaResponse.class
	)
	@Override
	public HypermediaResponse deleteBook(@ApiParam(value="id") @PathParam("id") String id)
			  throws UnknownHostException, Exception {
		log.log(Level.INFO, "Book ID: {0}", id);
		
		DBCollection bookColl = this.getCollection("bookstore", "book");
		DBObject book = bookColl.findOne(new BasicDBObject("_id", new ObjectId(id)), new BasicDBObject());
		
		if (book != null) {
			WriteResult result = bookColl.remove(book);

			if (result.getError() == null) {
				List<HypermediaLink> link = new ArrayList<>();
				link.add(new HypermediaLink());
				this._links.clear();
				this._links.add(link);

				return new HypermediaResponse(book, this._links);
			} else {
				throw new Exception("An error occured when updating an existing record!");
			}
		} else {
			throw new Exception("An existing record has not been found!");
		}
	}

	@Path("/contact")
	@GET
	@ApiOperation(
		value = "Get the contact",
		response = HypermediaResponse.class
	)
	@Override
	public HypermediaResponse getContact() throws UnknownHostException {
		DBCollection contactColl = this.getCollection("bookstore", "contact");
		DBObject contact = contactColl.findOne(new BasicDBObject(), new BasicDBObject(/*"_id", 0*/));
		
		if (this._isAuthorized == true) {
			List<HypermediaLink> link = new ArrayList<>();
			
			HypermediaLink media1 = new HypermediaLink();
			media1.setAction("CREATE");
			media1.setUrl("/book/new");

			HypermediaLink media2 = new HypermediaLink();
			media2.setAction("EDIT");
			media2.setUrl("/book/edit/" + contact.get("_id"));

			HypermediaLink media3 = new HypermediaLink();
			media3.setAction("DELETE");
			media3.setUrl("/book/delete/" + contact.get("_id"));
			
			contact.removeField("_id");
			
			link.add(media1);
			link.add(media2);
			link.add(media3);
			
			this._links.clear();
			this._links.add(link);
		}
		
		return new HypermediaResponse(contact, this._links);
	}
/*
	@Path("file/upload/{id}")
	@POST
//	@Consumes("application/jpg+jpeg")
	@ApiOperation(
		value = "Upload a file",
		response = MongoResponse.class
	)
	@ApiResponses(value = {
		@ApiResponse(code = 300, message = "Internal error"),
		@ApiResponse(code = 404, message = "Not found")
	})
	public Response loadFile(@Context HttpServletRequest request, @PathParam("id") String id) throws IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
		StringBuilder payload = new StringBuilder();
		String line;

		while ((line = br.readLine()) != null) {
			payload.append(line);
		}
		br.close();

		log.log(Level.INFO, "Payload: {0}", payload.toString());
		return Response.status(200).entity("").build();
	}
*/
}
