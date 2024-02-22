import fs from 'fs';
import path from 'path';
import Sqlite3 from 'sqlite3';
// const sqlite3 = require('sqlite3').verbose();

export async function closeSQLite(app: App) {
  const db = app.context.db;
  db.serialize(() => {
    const dbPathFile = path.resolve(path.dirname(__filename), 'db', 'main.db');
    const dbBackupPathFile = path.resolve(
      path.dirname(__filename),
      'backup',
      'main.backup.db'
    );

    db.close((err: Error) => {
      if (err) {
        console.error('关闭数据库失败', err.message);
      } else {
        // 拷贝数据库文件到备份文件
        fs.copyFileSync(dbPathFile, dbBackupPathFile);
      }
    });
  });
}

export async function createSQLite(app: App) {
  // 调用 .verbose() 方法，它会使 SQLite3 在运行时输出详细的调试信息，包括 SQL 语句的执行情况、错误信息等。
  const sqlite3 = Sqlite3.verbose();
  const dbPath = path.resolve(path.dirname(__filename), 'db');

  // 连接到一个 SQLite 数据库文件
  const db = new sqlite3.Database(`${dbPath}/main.db`, (err) => {
    if (err) {
      console.error('打开数据库失败', err.message);
    } else {
      console.log('成功连接到数据库');
    }
  });

  // 检测用户表是否已存在
  // db.get('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'users_table\'', (err, row) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }

  //   if (row) {
  //     // console.log('表已存在');
  //   } else {
  //   }
  // });

  db.serialize(() => {
    // 创建一个表格
    // CREATE TABLE IF NOT EXISTS 是一个 SQL 语句，用于创建表时检查表是否已存在。如果表已经存在，那么这个语句不会执行任何操作，也不会报错。如果表不存在，它将创建一个新的表。
    db.run(
      'CREATE TABLE IF NOT EXISTS users_table (id INTEGER PRIMARY KEY AUTOINCREMENT, open_id CHAR(28), nickname VARCHAR(255), avatar VARCHAR(255), gender INTEGER, country VARCHAR(255), province VARCHAR(255), city VARCHAR(255), created_at TIMESTAMP, updated_at TIMESTAMP)'
    );

    // 添加表和列的注释
    db.run('PRAGMA table_info(users_table)');
    // db.run('PRAGMA table_info(users_table) = \'用户表\'');
    // db.run('PRAGMA table_info(users_table.open_id) = \'微信小程序OpenID\'');
    // db.run('PRAGMA table_info(users_table.nickname) = \'用户昵称\'');
    // db.run('PRAGMA table_info(users_table.avatar) = \'用户头像URL\'');
    // db.run(
    //   'PRAGMA table_info(users_table.gender) = \'用户性别，0表示未知，1表示男性，2表示女性\''
    // );
    // db.run('PRAGMA table_info(users_table.country) = \'用户所在国家\'');
    // db.run('PRAGMA table_info(users_table.province) = \'用户所在省份\'');
    // db.run('PRAGMA table_info(users_table.city) = \'用户所在城市\'');
    // db.run('PRAGMA table_info(users_table.created_at) = \'记录创建时间\'');
    // db.run('PRAGMA table_info(users_table.updated_at) = \'记录最后更新时间\'');

    // // 插入数据
    // const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
    // stmt.run('John Doe');
    // stmt.run('Jane Smith');
    // stmt.finalize();

    // // 查询数据
    // db.each<{ id: string; name: string }>(
    //   'SELECT id, name FROM users',
    //   (err, row) => {
    //     if (err) {
    //       console.error(err.message);
    //     } else {
    //       console.log(`${row.id}: ${row.name}`);
    //     }
    //   }
    // );
  });

  app.context.db = db;
  app.context.sqlite3 = sqlite3;
}
