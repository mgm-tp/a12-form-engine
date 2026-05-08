package com.mgmtp.a12.melies.model;

import com.mgmtp.a12.model.header.DefaultHeaderParser;
import com.mgmtp.a12.model.header.HeaderParseException;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.regex.Pattern;
import java.util.stream.Stream;

public class TestSerialization {

	private static final Pattern WINDOWS_LINE_BREAK = Pattern.compile("\\r\\n?");

	@DataProvider(name = "data-provider")
	public Object[][] dataProviderMethod() throws IOException {
		try (Stream<Path> stream = Files.walk(Paths.get("build/models"))) {
			return stream.filter(Files::isRegularFile)
				.filter(path -> path.toString().endsWith(".json"))
				.filter(this::isFormModel)
				.map(path -> new Object[]{path})
				.toArray(Object[][]::new);
		}
	}

	private boolean isFormModel(final Path path) {
		try {
			final String jsonString = Files.readString(path);
			final String type = new DefaultHeaderParser().parseJson(jsonString).getModelType();
			return MeliesModel.MODEL_TYPE.equals(type);
		} catch (final HeaderParseException | IOException ignored) {
			return false;
		}
	}

	private String normalizeNewline(final CharSequence text) {
		return WINDOWS_LINE_BREAK.matcher(text).replaceAll("\n").strip();
	}

	@Test(dataProvider = "data-provider")
	void testSerializationRoundTrip(final Path file) throws IOException {
		final String jsonString = Files.readString(file);
		final MeliesModelJsonSerializer serializer = new MeliesModelJsonSerializer();
		final MeliesModel model = serializer.fromJsonString(jsonString);
		final String serializedModel = serializer.toJsonString(model);
		Assert.assertEquals(model.header.getModelVersion(), MeliesModel.MODEL_VERSION);
		Assert.assertEquals(normalizeNewline(serializedModel), normalizeNewline(jsonString));
	}
}
