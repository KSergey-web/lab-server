export abstract class CommandHelper {
    static indexToCommand(ind: number, length: number = 8): string {
        const command = Array(length).fill(0);
        command[ind] = 1;
        return command.join('');
    }
}