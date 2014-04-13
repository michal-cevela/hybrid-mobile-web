package cz.angular.cordova.ws.filter;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Enable CORS (Cross-Origin Resource Sharing)
 * 
 * @author Michal Čevela
 * @version 1.0
 * @since March 2014
 */
@WebFilter(
	filterName  = "CorsFilter",
	urlPatterns = { "/api/*" },
	asyncSupported = true
)
public class CorsFilter extends OncePerRequestFilter {

	private static final Logger log = Logger.getLogger(CorsFilter.class.getName());
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
		log.log(Level.INFO, "CorsFilter: {0}", request.getHeader("origin"));
		
		response.addHeader("Access-Control-Allow-Origin", request.getHeader("origin"));
		response.setHeader("Access-Control-Allow-Credentials", "true");
		response.addHeader("Access-Control-Allow-Methods", "OPTIONS, HEAD, GET, PUT, POST, DELETE");
		response.addHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-Type, x-requested-with, X-Auth-Token");
		response.addHeader("Access-Control-Max-Age", "1800"); //30 mins
		
		chain.doFilter(request, response);
	}
}
