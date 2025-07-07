async function main() {
  const target = process.env.SEED_TARGET;

  if (target === "recommendation") {
    console.log("recommendation seed 실행");
    await import("./seedForRecommendation");
  } else {
    console.log("기본 전체 seed 실행");
    await import("./seedDeploy");
  }
}

main();
