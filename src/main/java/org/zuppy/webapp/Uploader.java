package org.zuppy.webapp;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.glassfish.jersey.media.multipart.BodyPart;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.JSONObject;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

@Path("uploader")
public class Uploader {
	@SuppressWarnings("unused")
	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, String> getForms(FormDataMultiPart files, @FormDataParam("image") InputStream file, @FormDataParam("image") FormDataBodyPart details, @FormDataParam("file-type") String fileType, @Context HttpServletRequest request, @CookieParam("username") String user, @CookieParam("id") String id) throws SQLException, InterruptedException {
		ServletContext context = request.getServletContext();
		// Map result in JSON (@Produces Application/JSON)
		Map<String, String> result = new HashMap<>();
		String home = context.getContextPath();
		String realPath = context.getRealPath(".");
		
		try {
			String updType = files.getField("type").getEntityAs(String.class); // upload type
			ArrayList<JSONObject> fileList = new ArrayList<>();

			String dateCreated = DateUtil.getFullDate();
			
			if (updType.equals("messageFiles") || updType.equals("storyFiles")){
				
				for (BodyPart bodyPart:files.getBodyParts()) {
					Thread.sleep(1000);
					Date date = new Date();
					String fileDispoName = bodyPart.getContentDisposition().getFileName();
					if (fileDispoName != null) {
						String[] strArr = fileDispoName.split("\\.");
						// file extension
						String ext = strArr[strArr.length-1];
						String fileName = ("zpfile-"+date.toInstant()+"."+ext).replace(":","");
						String mediaType = bodyPart.getMediaType().getSubtype();
						FilePath filePath = new FilePath(context);
						filePath.makedir(user+"/"+updType, true);
				
						InputStream inputStream = bodyPart.getEntityAs(InputStream.class);
						
						try {
							OutputStream out = new FileOutputStream(realPath+"/users/"+user+"/"+updType+"/"+fileName);
							
							int read = 0;
							byte[] bytes = new byte[1024];
							while((read = inputStream.read(bytes)) != -1) {
								out.write(bytes);
							}
							out.flush();
							out.close();
							
							JSONObject newfile = new JSONObject();
							newfile.put("filename", fileName);
							newfile.put("author", user);
							newfile.put("authorid", id);
							newfile.put("filepath", home+"/users/"+user+"/"+updType+"/"+fileName);
							newfile.put("dateCreated",DateUtil.getFullDate(true));
							newfile.put("timeCreated", DateUtil.getTime());
							fileList.add(newfile);
						}
						catch(IOException e) {
							result.put("status", "failed");
							result.put("description", "File upload failed, please try again.");
						}
					}
				}

				if (updType.equals("messageFiles")) {
					String message = files.getField("message").getEntityAs(String.class); // message content
					int receiver = Integer.valueOf(files.getField("receiver").getEntityAs(String.class)); // message receiver ID
					// save message to database after upload
					Statement stat = ZuppyDB.getConnection();
					stat.executeUpdate("INSERT INTO messages (Sender, Receiver, Data, Attachments) VALUES ('"
						+id+"','"+receiver+"', '"+message+"','"+fileList.toString()+"')");
					// setup map response
					result.put("status", "success");
					result.put("description", "Files uploaded successfully.");
					result.put("message", message);
					result.put("fileList", fileList.toString());
					result.put("dateCreated",DateUtil.getFullDate(true));
					result.put("timeCreated", DateUtil.getTime());
				}
				if (updType.equals("storyFiles")) {
					// save stories to database after upload
					Statement stat = ZuppyDB.getConnection();
					stat.executeUpdate("INSERT INTO stories (Author, Files) VALUES ('"
						+id+"','"+fileList.toString()+"')");
					// setup map response
					result.put("status", "success");
					result.put("description", "Files uploaded successfully.");
					result.put("fileList", fileList.toString());
					result.put("dateCreated",DateUtil.getFullDate(true));
					result.put("timeCreated", DateUtil.getTime());
				}
			}
		}
		catch (NullPointerException e) { /* escape nullpointer */ }
		
		// Profile image uploader
		if (details != null) {
			Date date = new Date();
			String filename = details.getContentDisposition().getFileName();
			String ext = filename.split("\\.")[filename.split("\\.").length-1];
			String fileName = ("zpimg-"+date.toInstant()+"."+ext).replace(":","");
			FilePath filePath = new FilePath(context);
			filePath.makedir(user+"/"+fileType, true);
	
			try {
				OutputStream out = new FileOutputStream(realPath+"/users/"+user+"/"+fileType+"/"+fileName);
				int read = 0;
				byte[] bytes = new byte[1024];
				while((read = file.read(bytes)) != -1) {
					out.write(bytes);
				}
				out.flush();
				out.close();
				
				// update database after upload if fileType is avatar
				if (fileType.equals("avatar")) {
					Statement stat = ZuppyDB.getConnection();
					stat.executeUpdate("UPDATE profile SET avatar = '"+fileName+"' WHERE UID = (SELECT ID FROM users WHERE username = '"+user+"')");
				}
				// setup map response
				result.put("status", "success");
				result.put("filename", fileName);
				result.put("description", "File uploaded successfully.");
				result.put("filePath", home+"/users/"+user+"/"+fileType+"/"+fileName);
			}
			catch(IOException | SQLException e) {
				result.put("status", "failed");
				result.put("description", "File upload failed, please try again.");
				e.printStackTrace();
			}
		}
		return result;
	}
}
