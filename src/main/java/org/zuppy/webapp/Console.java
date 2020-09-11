package org.zuppy.webapp;

public class Console {
	public static String log(Object data) {
		System.out.println(data);
		return "<script>console.log(\""+data+"\");</script>";
	}
}
