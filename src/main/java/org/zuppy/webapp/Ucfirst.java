package org.zuppy.webapp;

public class Ucfirst {
	/** Method to capitalize first letter of a string **/
	public static String capitalize(String data) {
		return data.substring(0,1).toUpperCase()+data.substring(1, data.length()).toLowerCase();
	}
}
