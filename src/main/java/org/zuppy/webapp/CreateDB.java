package org.zuppy.webapp;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import com.mysql.jdbc.Driver;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("createdb")
/** Method to create database **/
public class CreateDB {
	private String dbName = "ZuppyDB";
	private final static String dbuser = "zuppydb";
	private final static String dbpass = "test#zuppy";
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String createDatabase() {
		try {
			//for production mode change 127.0.0.1 to 34.66.202.57
			DriverManager.registerDriver(new Driver());
			Connection conn = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/", dbuser, dbpass);
			Statement sql = conn.createStatement();
			sql.execute("CREATE DATABASE "+dbName);
			Console.log("Output: Database ["+dbName+"] created successfully.");
			sql.execute("USE "+dbName);
			//create user's account table
			sql.execute("CREATE TABLE IF NOT EXISTS users ("
					+ "ID int(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,"
					+ "Firstname varchar(50) NOT NULL,"
					+ "Lastname varchar(50) NOT NULL,"
					+ "Email varchar(50) NOT NULL UNIQUE,"
					+ "DOB DATE NOT NULL,"
					+ "Gender varchar(20) NOT NULL,"
					+ "Country varchar(50) NOT NULL,"
					+ "Telephone varchar(50) DEFAULT 'N/A',"
					+ "Username varchar(50) NOT NULL UNIQUE,"
					+ "Password LONGTEXT COLLATE latin1_general_cs NOT NULL,"
					+ "DateCreated DATE NOT NULL"
					+ ")");
			Console.log("Output: Database Table [users] created successfully.");
			//create user profile table
			sql.execute("CREATE TABLE IF NOT EXISTS profile ("
					+ "PID int(10) AUTO_INCREMENT NOT NULL PRIMARY KEY, UID int(10) NOT NULL,"
					+ "FOREIGN KEY (UID) REFERENCES Users(ID) ON DELETE CASCADE,"
					+ "JobTitle varchar(50) NOT NULL DEFAULT 'N/A',"
					+ "WorkPlace varchar(50) NOT NULL DEFAULT 'N/A',"
					+ "HighestEducation varchar(10) NOT NULL DEFAULT 'N/A',"
					+ "Relationship varchar(10) NOT NULL DEFAULT 'Single',"
					+ "Blockquote varchar(250) NOT NULL DEFAULT 'Hey Zuppy! Great power comes great responsibility!',"
					+ "Avatar varchar(100) NOT NULL DEFAULT 'avatar.png',"
					+ "LastUpdated DATE NOT NULL"
					+ ")");
			Console.log("Output: Database Table [profile] created successfully.");
			//create user request table
			sql.execute("CREATE TABLE IF NOT EXISTS requests ("
					+ "RQID int(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,"
					+ "Sender int(10) NOT NULL,"
					+ "Receiver int(10) NOT NULL,"
					+ "FOREIGN KEY (Sender) REFERENCES Users(ID) ON DELETE CASCADE,"
					+ "FOREIGN KEY (Receiver) REFERENCES Users(ID) ON DELETE CASCADE,"
					+ "Status varchar(10) NOT NULL DEFAULT 'pending',"
					+ "Blocked_by int(10) NOT NULL DEFAULT '0',"
					+ "DateCreated DATE NOT NULL,"
					+ "TimeCreated TIMESTAMP NOT NULL"
					+ ")");
			Console.log("Output: Database Table [requests] created successfully.");
			//create user contact list table
			sql.execute("CREATE TABLE IF NOT EXISTS contact_list ("
					+ "CLID int(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,"
					+ "Owner int(10) NOT NULL,"
					+ "Member int(10) NOT NULL,"
					+ "FOREIGN KEY (Owner) REFERENCES Users(ID) ON DELETE CASCADE,"
					+ "FOREIGN KEY (Member) REFERENCES Users(ID) ON DELETE CASCADE,"
					+ "Status varchar(10) NOT NULL DEFAULT 'friends',"
					+ "TimeCreated TIMESTAMP NOT NULL"
					+ ")");
			Console.log("Output: Database Table [contact_list] created successfully.");
			//create message table
			sql.execute("CREATE TABLE IF NOT EXISTS messages ("
					+ "MID int(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,"
					+ "Sender int(10) NOT NULL,"
					+ "Receiver int(10) NOT NULL,"
					+ "Data LONGTEXT,"
					+ "FOREIGN KEY (Sender) REFERENCES Users(ID) ON DELETE CASCADE,"
					+ "FOREIGN KEY (Receiver) REFERENCES Users(ID) ON DELETE CASCADE,"
					+ "Type varchar(10) NOT NULL DEFAULT 'private',"
					+ "Attachments LONGTEXT,"
					+ "Status varchar(10) NOT NULL DEFAULT 'unread',"
					+ "DateCreated TIMESTAMP NOT NULL"
					+ ")");
			Console.log("Output: Database Table [messages] created successfully.");
			//create story table
			sql.execute("CREATE TABLE IF NOT EXISTS stories ("
					+ "STID int(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,"
					+ "Author int(10) NOT NULL,"
					+ "Audience varchar(10) NOT NULL DEFAULT 'friends',"
					+ "FOREIGN KEY (Author) REFERENCES Users(ID) ON DELETE CASCADE,"
					+ "Files LONGTEXT NOT NULL,"
					+ "Status varchar(10) NOT NULL DEFAULT 'unseen',"
					+ "DateCreated TIMESTAMP NOT NULL"
					+ ")");
			Console.log("Output: Database Table [stories] created successfully.");
			
			return Console.log("Output: Database creation completed successfully.")
			+"Output: Database creation completed successfully.";
		} catch (SQLException e) {
			return Console.log("Error: "+e)
					+"Error: "+e;
		}
	}
}