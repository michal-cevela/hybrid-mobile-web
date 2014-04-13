package cz.angular.cordova.ws.provider;

import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.List;
import java.util.logging.Logger;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyReader;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;
import javax.servlet.http.HttpServletRequest;
import org.json.XML;

/**
 * Provider: XML
 * 
 * Used within /WEB-INF/spring/cxf-ws.xml
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since March 2014
 * @param <T>
 */
@Provider
@Consumes("application/xml;charset=UTF-8")
@Produces("application/xml;charset=UTF-8")
public class XmlProvider<T> implements MessageBodyReader<T>, MessageBodyWriter<T> {

	@Context
	private HttpServletRequest request;
	
	private static final Logger log = Logger.getLogger(XmlProvider.class.getName());
	
	/**
	 * Constructor
	 */
	public XmlProvider() {
		log.info("CXF: XmlProvider has been initialized...");
	}
	
	@Override
	public long getSize(T t, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
		return -1;
	}

	@Override
	public boolean isWriteable(Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
		return true;
	}

	@Override
	public void writeTo(T object, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType,
				MultivaluedMap<String, Object> httpHeaders, OutputStream entityStream)
					throws IOException, WebApplicationException {
		
		List<DBObject> records;
		
		PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(entityStream, "UTF-8"), true);
		
//		jaxbContext.createMarshaller().marshal((Book) object, entityStream);
		
		String content = new String(object.toString().getBytes("UTF-8"), "UTF-8");
		StringBuilder xml = new StringBuilder();
		
		if ( content.trim().startsWith("[") && content.trim().endsWith("]") ) {
			records = (List<DBObject>) JSON.parse(content);
		} else {
			records = (List<DBObject>) JSON.parse("[" + content + "]");
		}
		
		if (records.size() == 1) {
			DBObject record = records.get(0);
			xml.append("<record>");
			
			for (String key : record.keySet()) {
				 xml.append("<").append(key).append(">").append(record.get(key)).append("</").append(key).append(">");
			}
			xml.append("</record>");
		} else {
			xml.append("<records>");
			
			for (DBObject record : records) {
				xml.append("<record>");

				for (String key : record.keySet()) {
					 xml.append("<").append(key).append(">").append(record.get(key)).append("</").append(key).append(">");
				}
				xml.append("</record>");
			}
			xml.append("</records>");
		}
		
		printWriter.write(xml.toString());
		printWriter.flush();
		printWriter.close();
	}

	@Override
	public boolean isReadable(Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
		return true;
	}

	@Override
	public T readFrom(Class<T> type, Type gnericType, Annotation[] annotations, MediaType mediaType,
					MultivaluedMap<String, String> httpHeaders, InputStream entityStream)
						throws IOException, WebApplicationException {
		
		BufferedReader br = new BufferedReader(new InputStreamReader(entityStream, "UTF-8"));
		StringBuilder xmlPayload = new StringBuilder();
		String line;
		
		while ((line = br.readLine()) != null) {
			xmlPayload.append(line);
		}
		
		try {
//			return (Book) unmarshaller.unmarshal(entityStream);
			return (T) XML.toJSONObject(xmlPayload.toString()).toString();
		} finally {
			br.close();
		}
	}
}
