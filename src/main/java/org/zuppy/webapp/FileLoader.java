package org.zuppy.webapp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/* File loader class */
public class FileLoader {
	private String content;
	/* Constructor */
	public FileLoader() {
		content = "";
	}
	/* Include file method */
	public void include(String filename, Class<?> className) throws IOException {
		ClassLoader classLoader = className.getClassLoader();
		InputStream inputStream = classLoader.getResourceAsStream(filename);
		InputStreamReader stream = new InputStreamReader(inputStream, "UTF-8");
		BufferedReader reader = new BufferedReader(stream);
		// retrieve lines from file
		for (String line; (line = reader.readLine()) != null;) {
			content +=line+"\n";
		}
	}
	/* Get file content */
	public String getContent() {
		return content;
	}
	/* set or replace strings in content */
	public String setVar(String str, String replace) {
		String x = replace;
		replace = x != null ? x:"";
		content = getContent().replace(str, replace.toString());
		return content;
	}
}