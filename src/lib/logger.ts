import fs from "fs";
import winston from "winston";

const logDir = "C:/logs";
if (!fs.existsSync(logDir)) {
  // 지정된 경로에 파일이 존재하는지
  fs.mkdirSync(logDir, { recursive: true }); // 지정된 경로로 디렉토리를 생성
}

const logger = winston.createLogger({
  level: "info", // info 이상 레벨만 기록됨 (info, warn, error);
  format: winston.format.simple(), //출력 형식 (심플 텍스트 형태)
  transports: [
    new winston.transports.Console(), // 콘솔에 출력
    new winston.transports.File({ filename: `${logDir}/app.log` }), //파일에 저장
  ],
});

// 기존 console.log 등을 가로채서 logger로 전달
console.log = (...args) => logger.info(args.join(" "));
console.info = (...args) => logger.info(args.join(" "));
console.warn = (...args) => logger.warn(args.join(" "));
console.error = (...args) => logger.error(args.join(" "));

export default logger;
