package org.zuppy.webapp;

import java.util.Calendar;

/** Date Utility Class: for easy date access **/
public class DateUtil {
	private static Calendar date = Calendar.getInstance();
	/** get full date method YY/MM/DD **/
	public static String getFullDate() {
		return getYear()+"-"+(getMonth()+1)+"-"+getDate();
	}
	/** get full date reverse DD/MM/YY **/
	public static String getFullDate(boolean rev) {
		if (rev == true)
			return getDate()+"-"+(getMonth()+1)+"-"+getYear();
		else
			return getYear()+"-"+(getMonth()+1)+"-"+getDate();
	}
	/** get year method **/
	public static int getYear() {
		return date.get(Calendar.YEAR);
	}
	/** get month method **/
	public static int getMonth() {
		return date.get(Calendar.MONTH);
	}
	/** get date method **/
	public static int getDate() {
		return date.get(Calendar.DATE);
	}
	public static String getTime() {
		return date.get(Calendar.HOUR)+":"+date.get(Calendar.MINUTE);
	}
}
