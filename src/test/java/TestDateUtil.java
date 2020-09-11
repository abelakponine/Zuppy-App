

import static org.junit.Assert.assertEquals;

import java.util.Calendar;

import org.junit.Test;
import org.zuppy.webapp.DateUtil;

/** Date Utility Class: for easy date access **/
public class TestDateUtil {
	
	@Test
	public void testDateUtil() {
		Calendar testDateUtil = Calendar.getInstance();
		int year = testDateUtil.get(Calendar.YEAR);
		int month = testDateUtil.get(Calendar.MONTH);
		int date = testDateUtil.get(Calendar.DATE);
		String fullDate = year+"-"+(month+1)+"-"+date;
		String fullDateRev = date+"-"+(month+1)+"-"+year;
		String time = testDateUtil.get(Calendar.HOUR)+":"+testDateUtil.get(Calendar.MINUTE);
		
		assertEquals(year, DateUtil.getYear());
		assertEquals(month, DateUtil.getMonth());
		assertEquals(date, DateUtil.getDate());
		assertEquals(fullDate, DateUtil.getFullDate());
		assertEquals(fullDateRev, DateUtil.getFullDate(true));
		assertEquals(time, DateUtil.getTime());
	}
}
