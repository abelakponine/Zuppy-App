package org.zuppy.webapp;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import com.mysql.jdbc.Driver;
/** Database connection class **/
public class ZuppyDB {
	private final static String dbname = "zuppyDB";
	private final static String dbuser = "zuppydb";
	private final static String dbpass = "test#zuppy";
	
	/** Method for initiating database connection **/
	public static Statement getConnection() throws SQLException {
		DriverManager.registerDriver(new Driver());
		//for production mode change 127.0.0.1 to 34.66.202.57
		Connection conn = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/"+dbname, dbuser, dbpass);
		Statement stat = conn.createStatement();
		return stat;
	}
}
