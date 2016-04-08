package;
import js.html.Element;

/**
 * ...
 * @author Urs Stutz
 */
class HTMLTools {

	public static function empty( element:Element ) {
		
		while ( element.hasChildNodes() ) {
			element.removeChild( element.lastChild );
		}
	}
	
}