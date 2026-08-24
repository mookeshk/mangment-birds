using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class LinkInventoryToExpense : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Unit",
                table: "InventoryItems",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "InventoryItems",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<int>(
                name: "ExpenseRecordId",
                table: "InventoryItems",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_ExpenseRecordId",
                table: "InventoryItems",
                column: "ExpenseRecordId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_ExpenseRecords_ExpenseRecordId",
                table: "InventoryItems",
                column: "ExpenseRecordId",
                principalTable: "ExpenseRecords",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_ExpenseRecords_ExpenseRecordId",
                table: "InventoryItems");

            migrationBuilder.DropIndex(
                name: "IX_InventoryItems_ExpenseRecordId",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "ExpenseRecordId",
                table: "InventoryItems");

            migrationBuilder.AlterColumn<string>(
                name: "Unit",
                table: "InventoryItems",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "InventoryItems",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
