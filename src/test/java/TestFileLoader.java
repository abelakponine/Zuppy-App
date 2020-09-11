

import static org.junit.Assert.assertEquals;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.junit.Test;
import org.zuppy.webapp.FileLoader;

/* File loader class */
public class TestFileLoader {
	
	@Test
	public void testFileLoader() throws IOException {
		String content = "";
		ClassLoader classLoader = TestFileLoader.class.getClassLoader();
		InputStream inputStream = classLoader.getResourceAsStream("header.html");
		InputStreamReader stream = new InputStreamReader(inputStream, "UTF-8");
		BufferedReader reader = new BufferedReader(stream);
		// retrieve lines from file
		for (String line; (line = reader.readLine()) != null;) {
			content +=line+"\n";
		}
		
		FileLoader fileLoader = new FileLoader();
		fileLoader.include("header.html", FileLoader.class);
		// verify content
		assertEquals(content,fileLoader.getContent());
	}
}