package cz.angular.cordova.ws;

import cz.angular.cordova.ws.media.HypermediaResponse;
import java.io.IOException;
import java.net.UnknownHostException;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;
import javax.jws.soap.SOAPBinding.ParameterStyle;
import javax.jws.soap.SOAPBinding.Style;

import javax.xml.bind.annotation.XmlSeeAlso;

/**
 * Bookstore: Interface for RESTful & SOAP service
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since March 2014
 */
@WebService
@SOAPBinding(style = Style.DOCUMENT, parameterStyle = ParameterStyle.WRAPPED)
@XmlSeeAlso({ /*Object.class, Object.class*/ })
public interface Bookstore {
   
	public HypermediaResponse getBooksList()
			  throws UnknownHostException;
	
	public HypermediaResponse getBook(@WebParam(name="id") String id)
			  throws UnknownHostException;
	
	public HypermediaResponse addBook(@WebParam(name="json") String payload)
			  throws UnknownHostException, Exception;
	
	public HypermediaResponse updateBook(@WebParam(name="id") String id, @WebParam(name="json") String payload)
			  throws IOException, Exception;
	
	public HypermediaResponse deleteBook(@WebParam(name="id") String id)
			  throws UnknownHostException, Exception;
	
	public HypermediaResponse getContact()
			  throws UnknownHostException;
}
