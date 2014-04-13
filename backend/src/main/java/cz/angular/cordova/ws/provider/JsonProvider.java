package cz.angular.cordova.ws.provider;

import com.mongodb.util.JSON;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.util.logging.Level;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyReader;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Provider: JSON
 * 
 * Used within /WEB-INF/spring/cxf-ws.xml
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since March 2014
 * @param <T>
 */
@Provider
@Consumes("application/json;charset=UTF-8")
@Produces("application/json;charset=UTF-8")
public class JsonProvider<T> implements MessageBodyReader<T>, MessageBodyWriter<T> {

	@Context
	private HttpServletRequest request;
	
	private static final Logger log = Logger.getLogger(JsonpProvider.class.getName());
	private String prefix;
	
	/**
	 * Constructor
	 */
	public JsonProvider() {
		log.info("CXF: JsonProvider has been initialized...");
	}
	
	/**
	 * Set a prefix
	 * @param prefix 
	 */
	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}
	
	/**
	 * Get the prefix
	 * @return String
	 */
	public String getPrefix() {
		return this.prefix;
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
		
		PrintWriter printWriter = new PrintWriter(new OutputStreamWriter(entityStream, "UTF-8"), true);
		
		try {
			String content = new String(object.toString().getBytes("UTF-8"), "UTF-8");
			String prettyContent;
			
			if ( content.trim().startsWith("[") && content.trim().endsWith("]") ) {
				prettyContent = new JSONArray(content).toString(2);
			} else {
				prettyContent = new JSONObject(content).toString(2);
			}
			
			log.log(Level.INFO, "JSON provider: {0}", prettyContent);
			
			if (this.prefix == null) {
				printWriter.write(prettyContent);
			} else {
				printWriter.write(this.getPrefix() + "\n" + prettyContent);
			}
			
			printWriter.flush();
		} finally {
			printWriter.close();
		}
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
		StringBuilder jsonPayload = new StringBuilder();
		String line;
		
		while ((line = br.readLine()) != null) {
			jsonPayload.append(line);
		}
		
		try {
			return (T) JSON.parse(jsonPayload.toString());
		} finally {
			br.close();
		}
	}
}
