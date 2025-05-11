
import { getCurrentWindow, LogicalSize, currentMonitor } from '@tauri-apps/api/window';


export const FocusMode = async () => {
  const monitor = await currentMonitor();
  const { width, height } = monitor.size;
  const scaleFactor = await getCurrentWindow().scaleFactor();
  const logicalWidth = Math.floor(width / scaleFactor);
  const logicalHeight = Math.floor(height / scaleFactor);
  const newWidth = Math.floor(logicalWidth * 1) / 6;
  const newHeight = Math.floor(logicalHeight * 0.95);
  await getCurrentWindow().setSize(new LogicalSize({ width: newWidth, height: newHeight }));
}

export const CompactMode = async () => {
  const monitor = await currentMonitor();
  const { width, height } = monitor.size;
  const scaleFactor = await getCurrentWindow().scaleFactor();
  const logicalWidth = Math.floor(width / scaleFactor);
  const logicalHeight = Math.floor(height / scaleFactor);
  const newWidth = Math.floor(logicalWidth * 1) / 4;
  const newHeight = Math.floor(logicalHeight * 0.95);
  await getCurrentWindow().setSize(new LogicalSize({ width: newWidth, height: newHeight }));
}

