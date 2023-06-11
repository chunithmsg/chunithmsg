import {
  isCompleteSubmissionRow,
  tryParseSubmissionRow,
} from "@/controllers/submissionController";

describe("Submission Controller", () => {
  it.each([
    {
      row: [
        "2023-06-11 19:54:28",
        "2023-06-11 20:25",
        "ignDude",
        "1007546",
        "",
        "1009226",
        "",
        "1008038",
        "FC",
        "3024810",
      ],
      expectedIsComplete: true,
    },
    {
      row: [
        "2023-06-11 19:54:28",
        "",
        "ignDude",
        "1007546",
        "",
        "1009226",
        "",
        "1008038",
        "FC",
        "3024810",
      ],
      expectedIsComplete: false,
    },
    {
      row: [
        "2023-06-11 19:54:28",
        "2023-06-11 20:25",
        "",
        "1007546",
        "",
        "1009226",
        "",
        "1008038",
        "FC",
        "3024810",
      ],
      expectedIsComplete: false,
    },
    {
      row: [
        "2023-06-11 19:54:28",
        "2023-06-11 20:25",
        "ignDude",
        "1007546",
        "",
        "",
        "",
        "1008038",
        "FC",
        "3024810",
      ],
      expectedIsComplete: false,
    },
  ])("Test isCompleteSubmissionRow", ({ row, expectedIsComplete }) => {
    const actualIsComplete = isCompleteSubmissionRow(row);
    expect(actualIsComplete).toBe(expectedIsComplete);
  });

  it.each([
    {
      row: [
        "2023-06-11 19:54:28",
        "2023-06-11 20:25",
        "ignDude",
        "1007546",
        "",
        "1009226",
        "",
        "1008038",
        "FC",
        "3024810",
      ],
      expectedOutput: {
        timestamp: 1686486300000,
        formSubmissionTimestamp: 1686484440000,
        ign: "ignDude",
        isDisqualified: false,
        isVoidSubmission: false,
        songScores: [
          {
            ajFcStatus: "",
            score: 1007546,
          },
          {
            ajFcStatus: "",
            score: 1009226,
          },
          {
            ajFcStatus: "FC",
            score: 1008038,
          },
        ],
      },
    },
    {
      row: [
        "2023-06-11 19:54:28",
        "Dude, where's my timestamp?",
        "ignDude",
        "1007546",
        "",
        "1009226",
        "",
        "1008038",
        "FC",
        "3024810",
      ],
      expectedOutput: undefined,
    },
  ])("Test tryParseSubmissionRow", ({ row, expectedOutput }) => {
    const actualOutput = tryParseSubmissionRow(row);
    expect(actualOutput).toStrictEqual(expectedOutput);
  });
});
