/**
 * Subtraction command - Subtract two numbers
 */
async function kurangCommand(context) {
    const { messageService, from, msg, args } = context;
    
    try {
        if (args.length < 2) {
            const usage = "Gunakan dengan cara kurang *angka* *angka*\n\n_Contoh_\n\nkurang 5 2";
            return await messageService.reply(from, usage, msg);
        }

        const num1 = parseFloat(args[0]);
        const num2 = parseFloat(args[1]);

        if (isNaN(num1) || isNaN(num2)) {
            return await messageService.reply(from, "Masukkan angka yang valid!", msg);
        }

        const result = num1 - num2;
        await messageService.reply(from, `${num1} - ${num2} = ${result}`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default kurangCommand; 