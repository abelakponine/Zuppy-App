package org.zuppy.webapp;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletContext;

import jakarta.ws.rs.core.Context;

/** File Path Class: For creating new directories and writing data to a file **/
public class FilePath {
	private String path = null;
	/* constructor */
	public FilePath(@Context ServletContext context) {
		setPath(context.getRealPath("."));
	}
	/** Method for writing data to a file, returns true if successful. The boolean 'append' is to write to the end of the file if set to 'true' **/
	public boolean saveToFile(String filepath, Object data, boolean append) throws FileNotFoundException, UnsupportedEncodingException {
		path = (getPath()+"/users/"+filepath).replace("\\", "/");
		FileOutputStream output = new FileOutputStream(path, append);
		OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
		try {
			writer.write(data.toString());
			writer.close();
			return true;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}
	/** Method for writing data to a file, it replaces the content of the file if exists. This is an override of saveToFile(String, boolean) without boolean, default is 'false' **/
	public boolean saveToFile(String filepath, Object data) throws FileNotFoundException, UnsupportedEncodingException {
		path = (getPath()+"/users/"+filepath).replace("\\", "/");
		FileOutputStream output = new FileOutputStream(path);
		OutputStreamWriter writer = new OutputStreamWriter(output, "UTF-8");
		try {
			writer.write(data.toString());
			writer.close();
			return true;
		}
		catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}
	public boolean makedir(String path) throws IOException {
		path = (getPath()+"/users/"+path).replace("\\", "/");
		File dir = new File(path);
		dir.mkdirs();
		dir.setExecutable(true, false);
		dir.setReadable(true, false);
		dir.setWritable(true, false);
		return true;
	}
	public boolean makedir(String path, boolean servletRoot) {
		path = (getPath()+"/users/"+path).replace("\\", "/");
		if (servletRoot) {
			File dir = new File(path);
			dir.mkdirs();
			dir.setExecutable(true, false);
			dir.setReadable(true, false);
			dir.setWritable(true, false);
			return true;
		}
		return true;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
}
