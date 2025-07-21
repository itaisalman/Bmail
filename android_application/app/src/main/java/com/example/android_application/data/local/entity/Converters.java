package com.example.android_application.data.local.entity;

import androidx.room.TypeConverter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Converters {

    @TypeConverter
    public static List<String> fromString(String value) {
        if (value == null || value.isEmpty()) return new ArrayList<>();
        return Arrays.asList(value.split(","));
    }

    @TypeConverter
    public static String fromList(List<String> list) {
        return list != null ? String.join(",", list) : "";
    }
}
