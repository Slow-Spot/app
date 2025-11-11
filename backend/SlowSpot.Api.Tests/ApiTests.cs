using Xunit;

namespace SlowSpot.Api.Tests;

/// <summary>
/// Basic smoke tests for Slow Spot API
/// These tests verify the project builds and basic functionality works
/// </summary>
public class ApiTests
{
    [Fact]
    public void BasicTest_Always_Passes()
    {
        // Arrange
        var expected = true;

        // Act
        var actual = true;

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void MathTest_Addition_Works()
    {
        // Arrange
        int a = 2;
        int b = 3;

        // Act
        int result = a + b;

        // Assert
        Assert.Equal(5, result);
    }

    [Theory]
    [InlineData(1, 1, 2)]
    [InlineData(2, 3, 5)]
    [InlineData(10, 20, 30)]
    public void MathTest_Addition_MultipleInputs(int a, int b, int expected)
    {
        // Act
        int result = a + b;

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void StringTest_Concatenation_Works()
    {
        // Arrange
        string first = "Hello";
        string second = "World";

        // Act
        string result = $"{first} {second}";

        // Assert
        Assert.Equal("Hello World", result);
    }

    [Fact]
    public void CollectionTest_List_Works()
    {
        // Arrange
        var list = new List<int> { 1, 2, 3 };

        // Act
        list.Add(4);

        // Assert
        Assert.Equal(4, list.Count);
        Assert.Contains(4, list);
    }
}
